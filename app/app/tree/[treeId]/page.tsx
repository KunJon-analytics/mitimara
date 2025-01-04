import React from "react";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EvidenceModal } from "./_component/evidence-modal";
import { VerificationTable } from "./_component/verification-table";
import TreeMap from "../../plant-tree/_components/tree-map";

const mockTreeData = {
  id: "tree_123456",
  code: "abc123",
  additionalInfo: "This is a beautiful oak tree.",
  latitude: 40.7128,
  longitude: -74.006,
  isAuthentic: true,
  rewardClaimed: false,
  dateVerified: new Date("2023-06-15"),
  planterId: "user_789012",
  createdAt: new Date("2023-05-01"),
  updatedAt: new Date("2023-06-15"),
  planter: {
    id: "user_789012",
    username: "EcoWarrior",
    accessToken: "mock_access_token",
    uid: "mock_uid",
    isActive: true,
    points: 150,
    referrer: null,
    noOfReferrals: 3,
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-06-15"),
  },
  mediaEvidence: [
    {
      id: "media_1",
      type: "VIDEO" as const,
      url: "https://www.youtube.com/watch?v=LXb3EKWsInQ",
    },
  ],
  verifications: [
    {
      id: "verification_1",
      verifier: {
        id: "user_345678",
        username: "GreenThumb",
      },
      createdAt: new Date("2023-05-15"),
      dateUpdated: new Date("2023-05-15"),
      rewardClaimed: true,
    },
    {
      id: "verification_2",
      verifier: {
        id: "user_901234",
        username: "NatureGuardian",
      },
      createdAt: new Date("2023-06-01"),
      dateUpdated: new Date("2023-06-01"),
      rewardClaimed: false,
    },
    {
      id: "verification_3",
      verifier: {
        id: "user_567890",
        username: "EarthProtector",
      },
      createdAt: new Date("2023-06-15"),
      dateUpdated: new Date("2023-06-15"),
      rewardClaimed: false,
    },
  ],
};

type TreeDetailPageParams = {
  params: Promise<{ treeId: string }>;
};

async function getTree(id: string) {
  const tree = await prisma.tree.findUnique({
    where: { id },
    include: {
      planter: true,
      mediaEvidence: true,
      verifications: {
        include: {
          verifier: true,
        },
      },
    },
  });

  if (!tree) notFound();

  return tree;
}

export default async function TreeDetail({ params }: TreeDetailPageParams) {
  const treeId = (await params).treeId;
  // const tree = await getTree(treeId);
  const tree = mockTreeData;

  // TODO: Replace with actual logged-in user ID
  // const currentUserId = "logged-in-user-id";
  const currentUserId = "user_789012";
  const isPlanter = currentUserId === tree.planterId;

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
            <div className="mt-4">
              <EvidenceModal
                treeId={tree.id}
                evidences={tree.mediaEvidence}
                isPlanter={isPlanter}
                // onAddEvidence={(evidence) => {
                //   // TODO: Implement server action to add evidence
                //   console.log("Adding evidence:", evidence);
                // }}
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
