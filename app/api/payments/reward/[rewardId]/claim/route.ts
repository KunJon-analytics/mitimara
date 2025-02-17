import { NextResponse, type NextRequest } from "next/server";

import { isValidAccessToken } from "@/lib/pi/platform-api-client";
import prisma from "@/lib/prisma";
import { getUserRewards } from "@/lib/local-bounty/utils";
import { siteConfig } from "@/config/site";
import { inngest } from "@/inngest/client";

export const maxDuration = 60;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ rewardId: string }> }
) {
  const id = (await params).rewardId;
  const { accessToken }: { accessToken: string } = await request.json();

  const validToken = await isValidAccessToken(accessToken);
  if (!validToken) {
    console.error("CLAIM_REWARDS", "Invalid Access Token");
    return NextResponse.json(
      { error: "Unauthorized", success: false },
      { status: 400 }
    );
  }

  try {
    const reward = await prisma.participantReward.findUnique({
      where: {
        id,
        isClaimed: false,
        localBounty: { endDate: { lt: new Date() } },
        user: { accessToken },
      },
      select: {
        treesPlanted: true,
        user: { select: { uid: true } },
        treesVerified: true,
        localBounty: {
          select: {
            bountyClaimed: true,
            endDate: true,
            totalBounty: true,
            participantRewards: {
              select: { treesVerified: true, treesPlanted: true },
              where: { isClaimed: false },
            },
          },
        },
      },
    });

    // return error if no reward
    if (!reward) {
      console.error("CLAIM_REWARDS", "Invalid request params");
      return NextResponse.json(
        { error: "Invalid request", success: false },
        { status: 404 }
      );
    }

    await prisma.participantReward.update({
      where: { id },
      data: { isClaimed: true },
    });

    const { localBounty, treesPlanted, treesVerified } = reward;

    const amount = getUserRewards({
      bountyClaimed: localBounty.bountyClaimed,
      bountyRewards: localBounty.participantRewards,
      endDate: localBounty.endDate,
      totalBounty: localBounty.totalBounty,
      userTreesPlanted: treesPlanted,
      userTreesVerified: treesVerified,
    });

    await inngest.send({
      name: "payments/app-to-user",
      data: {
        amount,
        memo: `Reward Payment for ${siteConfig.name} Bounty Hunt Contest`,
        purpose: id,
        type: "CLAIM_REWARD",
        uid: reward.user.uid,
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("CLAIM_REWARDS", error);
    return NextResponse.json(
      { error: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
