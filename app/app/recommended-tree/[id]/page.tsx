import {
  Leaf,
  Droplets,
  Sun,
  EarthIcon as Soil,
  Ruler,
  MapPin,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LocalNursery } from "@/types/pi";

async function getRecommendedTree(id: string) {
  const tree = await prisma.treeRecommendation.findUnique({
    where: {
      id,
    },
  });

  return tree;
}

export default async function RecommendedTreePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tree = await getRecommendedTree(id);

  if (!tree || tree.status !== "COMPLETED") {
    notFound();
  }

  return (
    <div className="container mx-auto p-4 space-y-6 mb-16">
      <h1 className="text-2xl font-bold">Recommended Tree</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          {tree.imageUrl ? (
            <img
              src={tree.imageUrl || "/assets/tree-placeholder.png"}
              alt={tree.commonName || "Your Recommended Tree"}
              className="w-full h-auto rounded-lg object-cover aspect-square"
            />
          ) : (
            <div className="w-full aspect-square bg-muted rounded-lg flex items-center justify-center">
              <Leaf className="h-24 w-24 text-muted-foreground" />
            </div>
          )}

          <div className="mt-4 space-y-2">
            <Badge variant="outline" className="w-full justify-center py-1.5">
              {tree.nativeToRegion
                ? "Native to Your Region"
                : "Adapted to Your Region"}
            </Badge>

            <Button asChild className="w-full">
              <Link href="/app/plant-tree">Plant This Tree</Link>
            </Button>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{tree.commonName}</CardTitle>
              <CardDescription>{tree.scientificName}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{tree.description}</p>

              <div className="mt-4">
                <h3 className="font-medium mb-2">
                  Why This Tree Is Perfect For You
                </h3>
                <p className="text-muted-foreground">
                  {tree.recommendationReason}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Planting Guide</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Best Planting Season</p>
                  <p className="text-muted-foreground">{tree.plantingSeason}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Ruler className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Planting Depth & Spacing</p>
                  <p className="text-muted-foreground">
                    Plant {tree.plantingDepth} deep with {tree.spacing} spacing
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Droplets className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Watering Needs</p>
                  <p className="text-muted-foreground">{tree.wateringNeeds}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Sun className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Sunlight Requirements</p>
                  <p className="text-muted-foreground">{tree.sunlightNeeds}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Soil className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Soil Requirements</p>
                  <p className="text-muted-foreground">
                    {tree.soilRequirements}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Growth & Benefits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">Growth Rate</p>
                  <p className="text-muted-foreground">{tree.growthRate}</p>
                </div>

                <div>
                  <p className="font-medium">Mature Size</p>
                  <p className="text-muted-foreground">
                    {tree.matureHeight} tall, {tree.matureWidth} wide
                  </p>
                </div>

                <div>
                  <p className="font-medium">Carbon Sequestration</p>
                  <p className="text-muted-foreground">
                    {tree.carbonSequestration}
                  </p>
                </div>

                <div>
                  <p className="font-medium">Wildlife Value</p>
                  <p className="text-muted-foreground">{tree.wildlifeValue}</p>
                </div>
              </div>

              {tree.indigenousUses && (
                <div className="mt-2">
                  <p className="font-medium">Indigenous Uses</p>
                  <p className="text-muted-foreground">{tree.indigenousUses}</p>
                </div>
              )}

              {tree.otherBenefits && (
                <div className="mt-2">
                  <p className="font-medium">Additional Benefits</p>
                  <p className="text-muted-foreground">{tree.otherBenefits}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {tree.localNurseries && (
            <Card>
              <CardHeader>
                <CardTitle>Where to Find This Tree</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(tree.localNurseries as LocalNursery[]).map(
                    (nursery, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-medium">{nursery.name}</p>
                          <p className="text-muted-foreground">
                            {nursery.address} ({nursery.distance})
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center pt-4">
        <Button variant="outline" asChild>
          <Link href="/app/my-recommendations">Back to Recommendations</Link>
        </Button>

        <Button asChild>
          <Link href="/app/plant-tree?recommended=true">Plant This Tree</Link>
        </Button>
      </div>
    </div>
  );
}
