import React from "react";
import { notFound } from "next/navigation";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getTree } from "@/lib/tree/services";
import { readPolicy } from "@/lib/services/filestack-policy";
import { VerificationTable } from "./_component/verification-table";
import TreeMap from "../../(geo-needed)/plant-tree/_components/tree-map";
import TreeInfoCard from "./_component/tree-info-card";

type TreeDetailPageParams = {
  params: Promise<{ treeId: string }>;
};

export default async function TreeDetail({ params }: TreeDetailPageParams) {
  const treeId = (await params).treeId;

  const tree = await getTree(treeId);
  const security = readPolicy;

  if (!tree) notFound();

  return (
    <div className="container mx-auto p-4 space-y-6 mb-16">
      <h1 className="text-3xl font-bold">Tree Details</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <TreeInfoCard
          additionalInfo={tree.additionalInfo ?? ""}
          datePlanted={tree.createdAt}
          evidences={tree.mediaEvidence}
          planter={tree.planter}
          security={security}
          treeId={tree.id}
          treeStatus={tree.status}
          treeIsAuthentic={tree.isAuthentic}
          localBounty={tree.localBounty}
        />

        <Card>
          <CardHeader>
            <CardTitle>Location</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] rounded-md overflow-hidden">
              <TreeMap latitude={tree.latitude} longitude={tree.longitude} />
            </div>
          </CardContent>
          <CardFooter className="text-sm">
            <p className="mt-2 text-center">
              <strong>Coordinates:</strong> {tree.latitude.toFixed(6)},{" "}
              {tree.longitude.toFixed(6)}
            </p>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Verifications</CardTitle>
        </CardHeader>
        <CardContent>
          <VerificationTable verifications={tree.verifications} />
        </CardContent>
      </Card>
    </div>
  );
}
