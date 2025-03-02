import { addDays, isAfter } from "date-fns";
import prisma from "../prisma";
import { getSecurityPolicy } from "./filestack-policy";
import { REWARD_COOLDOWN_DAYS } from "@/config/site";

export const getUserprofile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      _count: { select: { plantedTrees: true, treeVerifications: true } },
      noOfReferrals: true,
      points: true,
      bountyRewards: {
        where: { isClaimed: false },
        select: {
          id: true,
          treesPlanted: true,
          treesVerified: true,
          localBounty: { select: { title: true } },
        },
      },
    },
  });

  if (!user) {
    return null;
  }
  // add explicit permission to add images for one day
  const now = Math.floor(new Date().getTime() / 1000);
  const onedaySeconds = 60 * 60 * 24;
  const expiry = now + onedaySeconds;

  const security = getSecurityPolicy(["pick", "read"], expiry);

  return { ...user, security };
};

export const getUserRewards = async (userId: string) => {
  const user = await prisma.user.findFirst({
    where: { id: userId },
    select: {
      points: true,
      pointsExchanges: {
        select: { status: true, updatedAt: true, id: true, amount: true },
        orderBy: { createdAt: "desc" },
      },
      plantedTrees: {
        where: { isAuthentic: true },
        select: { updatedAt: true },
      },
      treeVerifications: {
        where: { tree: { isAuthentic: true } },
        select: { updatedAt: true },
      },
      createdAt: true,
    },
  });

  if (!user) {
    return null;
  }

  let lastExchange = user.createdAt;
  if (user.pointsExchanges.length > 0) {
    lastExchange = user.pointsExchanges[0].updatedAt;
  }

  const nextClaimDate = addDays(lastExchange, REWARD_COOLDOWN_DAYS);

  const eligiblePlantedTrees = user.plantedTrees.filter((pt) =>
    isAfter(pt.updatedAt, lastExchange)
  );
  const eligibleVerifications = user.treeVerifications.filter((tv) =>
    isAfter(tv.updatedAt, lastExchange)
  );
  const verifiedOrPlantedAuthTrees =
    eligiblePlantedTrees.length > 0 || eligibleVerifications.length > 0;

  const pendingExchanges = user.pointsExchanges.filter(
    (ex) => ex.status === "INITIATED"
  );

  const hasPendingExchange = pendingExchanges.length > 0;

  return {
    points: user.points,
    nextClaimDate,
    verifiedOrPlantedAuthTrees,
    hasPendingExchange,
    exchangeHistory: user.pointsExchanges,
  };
};
