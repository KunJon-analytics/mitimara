"use client";

import Link from "next/link";
import { Clock, Leaf, MapPin } from "lucide-react";

import useCurrentSession from "@/components/providers/session-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useProfile from "@/hooks/queries/use-profile";
import RecommendationsListSkeleton from "./recommendation-list-skeleton";
import RecommendationStatusBadge from "./recommendation-status-badge";

function RecommendationsList() {
  const { session } = useCurrentSession();
  const { data, isLoading } = useProfile(session.id);

  console.log({ data });

  if (isLoading) {
    return <RecommendationsListSkeleton />;
  }

  if (!session.isLoggedIn || !data) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">
            Login with your pi wallet to view your recommendations.
          </p>
        </CardContent>
      </Card>
    );
  }

  const recommendations = data.treeRecommendations;

  if (recommendations.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">
            You haven{"'"}t requested any tree recommendations yet.
          </p>
          <Button asChild className="mt-4">
            <Link href="/app/plant-tree">Request a Recommendation</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {recommendations.map((recommendation) => (
        <Card key={recommendation.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">
                {recommendation.commonName || "Tree Recommendation"}
              </CardTitle>
              <RecommendationStatusBadge status={recommendation.status} />
            </div>
            <CardDescription>
              {recommendation.scientificName && (
                <em>{recommendation.scientificName}</em>
              )}
              {!recommendation.scientificName &&
                recommendation.status === "PENDING" &&
                "Our AI is analyzing your location data..."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <MapPin className="h-4 w-4 mr-1" />
              <span>
                {recommendation.latitude.toFixed(4)},{" "}
                {recommendation.longitude.toFixed(4)}
              </span>
            </div>

            {recommendation.status === "PENDING" && (
              <div className="bg-muted p-3 rounded-md text-sm">
                <p>
                  Your recommendation is being processed. This typically takes
                  1-2 minutes.
                </p>
              </div>
            )}

            {recommendation.status === "COMPLETED" &&
              recommendation.description && (
                <p className="line-clamp-3 text-sm">
                  {recommendation.description}
                </p>
              )}

            {recommendation.status === "FAILED" && (
              <div className="bg-red-50 p-3 rounded-md text-sm text-red-800">
                <p>
                  We encountered an error while processing your recommendation.
                </p>
                <p className="font-medium mt-1">
                  Error: {recommendation.error || "Unknown error"}
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            {recommendation.status === "COMPLETED" && (
              <Button asChild className="w-full">
                <Link href={`/app/recommended-tree/${recommendation.id}`}>
                  <Leaf className="mr-2 h-4 w-4" />
                  View Full Recommendation
                </Link>
              </Button>
            )}

            {recommendation.status === "PENDING" && (
              <Button disabled className="w-full">
                <Clock className="mr-2 h-4 w-4 animate-pulse" />
                Processing...
              </Button>
            )}

            {recommendation.status === "FAILED" && (
              <Button asChild variant="outline" className="w-full">
                <Link href="/app/plant-tree">Try Again</Link>
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export default RecommendationsList;
