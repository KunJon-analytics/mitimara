import Link from "next/link";
import {
  TreesIcon as Tree,
  CheckCircle,
  Calendar,
  Target,
  ArrowRight,
} from "lucide-react";
import { notFound } from "next/navigation";
import { isPast } from "date-fns";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import prisma from "@/lib/prisma";
import { getUserRewards } from "@/lib/local-bounty/utils";
import RewardFooter from "./_components/reward-footer";

type RewardDetailPageProps = { params: Promise<{ rewardId: string }> };

export default async function RewardDetailPage({
  params,
}: RewardDetailPageProps) {
  const rewardId = (await params).rewardId;

  const reward = await prisma.participantReward.findUnique({
    where: { id: rewardId },
    select: {
      localBounty: {
        select: {
          title: true,
          id: true,
          endDate: true,
          startDate: true,
          bountyClaimed: true,
          totalBounty: true,
          participantRewards: {
            select: { treesVerified: true, treesPlanted: true },
            where: { isClaimed: false },
          },
        },
      },
      treesPlanted: true,
      treesVerified: true,
      isClaimed: true,
      userId: true,
    },
  });

  if (!reward) {
    notFound();
  }

  const huntEnded = isPast(reward.localBounty.endDate);

  const userRewards = getUserRewards({
    bountyClaimed: reward.localBounty.bountyClaimed,
    bountyRewards: reward.localBounty.participantRewards,
    endDate: reward.localBounty.endDate,
    totalBounty: reward.localBounty.totalBounty,
    userTreesPlanted: reward.treesPlanted,
    userTreesVerified: reward.treesVerified,
  });

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Reward Details</h1>
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>{reward.localBounty.title}</span>
            <Badge variant={huntEnded ? "secondary" : "default"}>
              {huntEnded ? "Ended" : "Active"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Tree className="h-5 w-5 text-green-600" />
              <span>{reward.treesPlanted} trees planted</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-blue-500" />
              <span>{reward.treesVerified} trees verified</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-purple-500" />
            <span>{userRewards} Pi tokens available</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-500" />
            <span>
              {reward.localBounty.startDate.toLocaleDateString()} -{" "}
              {reward.localBounty.endDate.toLocaleDateString()}
            </span>
          </div>
          <div className="pt-2">
            <Link
              href={`/app/local-bounty/${reward.localBounty.id}`}
              className="text-blue-500 hover:underline flex items-center"
            >
              View Hunt Details
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </CardContent>
        <RewardFooter
          rewardId={rewardId}
          huntEnded={huntEnded}
          rewardClaimed={reward.isClaimed}
          userId={reward.userId}
        />
      </Card>
    </div>
  );
}
