import React from "react";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTree } from "@/lib/tree/services";
import { EvidenceModal } from "./_component/evidence-modal";
import { VerificationTable } from "./_component/verification-table";
import TreeMap from "../../(geo-needed)/plant-tree/_components/tree-map";
import { AdditionalInfo } from "./_component/additional-info";

type TreeDetailPageParams = {
  params: Promise<{ treeId: string }>;
};

export default async function TreeDetail({ params }: TreeDetailPageParams) {
  const treeId = (await params).treeId;

  const tree = await getTree(treeId);
  if (!tree) notFound();

  const currentUserId = "user_789012";
  const isPlanter = currentUserId === tree.planter.id;

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Tree Details</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tree Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              <strong>Tree ID:</strong> {tree.id}
            </p>
            <p>
              <strong>Planted by:</strong> {tree.planter.username}
            </p>
            <p>
              <strong>Planted on:</strong> {tree.createdAt.toLocaleDateString()}
            </p>
            <div>
              <strong>Status:</strong>{" "}
              <Badge variant={tree.isAuthentic ? "success" : "secondary"}>
                {tree.isAuthentic ? "Verified" : "Pending Verification"}
              </Badge>
            </div>
            <div>
              <strong>Reward:</strong>{" "}
              <Badge variant={tree.rewardClaimed ? "success" : "secondary"}>
                {tree.rewardClaimed ? "Claimed" : "Not Claimed"}
              </Badge>
            </div>
            <AdditionalInfo
              initialInfo={tree.additionalInfo || ""}
              planterId={tree.planter.id}
              treeId={treeId}
            />
            <div className="mt-4">
              <EvidenceModal
                treeId={tree.id}
                evidences={tree.mediaEvidence}
                planterId={tree.planter.id}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Location</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] rounded-md overflow-hidden">
              <TreeMap latitude={tree.latitude} longitude={tree.longitude} />
            </div>
            <p className="mt-2 text-center">
              <strong>Coordinates:</strong> {tree.latitude.toFixed(6)},{" "}
              {tree.longitude.toFixed(6)}
            </p>
          </CardContent>
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
