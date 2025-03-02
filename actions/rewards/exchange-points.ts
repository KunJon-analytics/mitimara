"use server";

import { isFuture, subDays } from "date-fns";
import { revalidatePath } from "next/cache";

import {
  MIN_EXCHANGE_POINTS,
  STARTER_POINTS,
  REWARD_COOLDOWN_DAYS,
} from "@/config/site";
import { isValidAccessToken } from "@/lib/pi/platform-api-client";
import prisma from "@/lib/prisma";
import { getPointCoefficient } from "@/lib/services/stats";
import { inngest } from "@/inngest/client";
import { getUserRewards } from "@/lib/services/profile";

export async function exchangePoints(accessToken: string) {
  const validToken = await isValidAccessToken(accessToken);
  if (!validToken) {
    console.error("Failed to exchange points:", "Invalid Access Token");
    return { error: "Unauthorized!", success: false };
  }

  try {
    // get user with points, trees, verifications and exchanges
    const { id: userId } = await prisma.user.findFirstOrThrow({
      where: { accessToken },
      select: { id: true },
    });

    const user = await getUserRewards(userId);

    if (!user) {
      return { error: "Unauthorized!", success: false };
    }

    // user must have above subscription points
    if (user.points < MIN_EXCHANGE_POINTS) {
      return { error: "Insufficient points!", success: false };
    }

    // there must be no pending points exchange

    if (user.hasPendingExchange) {
      return { error: "Pending exchange!", success: false };
    }

    // previous exchange / account must be at least a month old

    if (isFuture(user.nextClaimDate)) {
      return {
        error: `You are not yet eligible for your next exchange`,
        success: false,
      };
    }

    // must have planted or verified a real tree within stipulated time

    if (!user.verifiedOrPlantedAuthTrees) {
      return {
        error: "No authentic tree planted or verified!",
        success: false,
      };
    }

    // calculate claimmable pi amount (user points - 10) * exchange coefficient
    const coef = await getPointCoefficient();
    const pointsTraded = user.points - STARTER_POINTS;
    const amount = pointsTraded * coef;

    const exchange = await prisma.pointsForPiExchange.create({
      data: {
        amount,
        lastExchange: subDays(user.nextClaimDate, REWARD_COOLDOWN_DAYS),
        type: "PLANTER_VERIFIER",
        userId,
        pointsTraded,
      },
      select: { id: true },
    });

    await inngest.send({
      name: "points/exchange.added",
      data: {
        id: exchange.id,
      },
    });

    revalidatePath("/app");

    return { success: true, exchangeId: exchange.id };
  } catch (error) {
    console.error("Failed to exchange points:", error);
    return { success: false, error: "Failed to exchange points" };
  }
}
