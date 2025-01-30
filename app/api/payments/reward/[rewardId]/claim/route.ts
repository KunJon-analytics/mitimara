import { NextResponse, type NextRequest } from "next/server";
import PiNetwork from "pi-backend";

import { isValidAccessToken } from "@/lib/pi/platform-api-client";
import prisma from "@/lib/prisma";
import { getUserRewards } from "@/lib/local-bounty/utils";
import { env } from "@/env.mjs";
import { PaymentData, PaymentDTOMemo } from "@/types/pi";
import { siteConfig } from "@/config/site";

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

    // DO NOT expose these values to public
    const apiKey = env.PI_API_KEY;
    const walletPrivateSeed = env.PI_SECRET_KEY; // starts with S
    const pi = new PiNetwork(apiKey, walletPrivateSeed);

    const userUid = reward.user.uid;
    const paymentData: PaymentData<PaymentDTOMemo> & { uid: string } = {
      amount,
      memo: `Reward Payment for ${siteConfig.name} Bounty Hunt Contest`, // this is just an example
      metadata: { purpose: id, type: "CLAIM_REWARD" },
      uid: userUid,
    };
    // It is critical that you store paymentId in your database
    // so that you don't double-pay the same user, by keeping track of the payment.
    const paymentId = await pi.createPayment(paymentData);

    await prisma.payment.create({
      data: {
        amount,
        paymentId,
        type: "CLAIM_REWARD",
        purposeId: id,
        status: "INITIALIZED",
      },
    });

    // It is strongly recommended that you store the txId along with the paymentId you stored earlier for your reference.
    const txId = await pi.submitPayment(paymentId);

    await prisma.payment.update({
      where: { paymentId },
      data: { txId, status: "COMPLETED" },
    });

    const { transaction } = await pi.completePayment(paymentId, txId);

    // send reward sent event

    return NextResponse.json({ success: true, transaction }, { status: 200 });
  } catch (error) {
    console.error("CLAIM_REWARDS", error);
    return NextResponse.json(
      { error: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
