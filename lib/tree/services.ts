import { treeLogicConfig } from "@/config/site";
import prisma from "../prisma";
import { calculateDistance } from "../utils";
import { verificationNotStartedStatus } from "./constants";

export const findNearbyTree = async (
  userId: string,
  latitude: number,
  longitude: number
) => {
  try {
    const trees = await prisma.tree.findMany({
      where: {
        dateVerified: null,
        planterId: { not: userId },
        verifications: { none: { verifierId: userId } },
        status: { in: ["LISTED", "VERIFYING"] },
      },
      select: {
        planter: { select: { username: true } },
        localBounty: {
          select: {
            centerLatitude: true,
            centerLongitude: true,
            totalBounty: true,
            radius: true,
            title: true,
            id: true,
            startDate: true,
            endDate: true,
            description: true,
            location: true,
          },
        },
        latitude: true,
        longitude: true,
        additionalInfo: true,
        id: true,
        mediaEvidence: { select: { type: true, url: true, id: true } },
        verifications: { select: { treeIsAuthentic: true } },
      },
      orderBy: { createdAt: "asc" }, //change to asc
    });

    const nearbyTrees = trees.filter(
      (tree) =>
        calculateDistance(latitude, longitude, tree.latitude, tree.longitude) <=
        treeLogicConfig.maxVerifierDistance
    );

    return nearbyTrees[0] || null;
  } catch (error) {
    console.error("FIND_NEARBY_TREE", error);
    return null;
  }
};

export async function getTree(id: string) {
  const tree = await prisma.tree.findUnique({
    where: { id },
    select: {
      localBounty: {
        select: {
          centerLatitude: true,
          centerLongitude: true,
          totalBounty: true,
          radius: true,
          title: true,
          id: true,
          startDate: true,
          endDate: true,
          description: true,
          location: true,
        },
      },
      planter: { select: { id: true, username: true } },
      createdAt: true,
      id: true,
      status: true,
      isAuthentic: true,
      rewardClaimed: true,
      additionalInfo: true,
      mediaEvidence: { select: { id: true, type: true, url: true } },
      latitude: true,
      longitude: true,
      verifications: {
        select: {
          id: true,
          createdAt: true,
          rewardClaimed: true,
          verifier: { select: { username: true } },
        },
      },
    },
  });

  return tree;
}

export async function getTreesAwaitingVerification(userId: string) {
  return await prisma.tree.findMany({
    where: {
      planterId: userId,
      status: { in: verificationNotStartedStatus },
    },
    select: { id: true, latitude: true, longitude: true, createdAt: true },
    orderBy: {
      createdAt: "desc",
    },
  });
}
