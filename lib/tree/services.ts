import { treeLogicConfig } from "@/config/site";
import prisma from "../prisma";
import { calculateDistance } from "../utils";
import { treeVerified } from "./utils";

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
      },
      select: {
        planter: { select: { username: true } },
        latitude: true,
        longitude: true,
        additionalInfo: true,
        id: true,
        mediaEvidence: { select: { type: true, url: true } },
        verifications: { select: { treeIsAuthentic: true } },
      },
    });
    const unverifiedTrees = trees.filter((tree) => !treeVerified(tree));

    const nearbyTrees = unverifiedTrees.filter(
      (tree) =>
        calculateDistance(latitude, longitude, tree.latitude, tree.longitude) <=
        treeLogicConfig.maxVerifierDistance
    );

    return nearbyTrees[0] || null;
  } catch (error) {
    return null;
  }
};

export async function getTree(id: string) {
  const tree = await prisma.tree.findUnique({
    where: { id },
    select: {
      planter: { select: { id: true, username: true } },
      createdAt: true,
      id: true,
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

export async function getUnverifiedTrees(userId: string) {
  return await prisma.tree.findMany({
    where: {
      planterId: userId,
      isAuthentic: false,
      verifications: {
        none: {},
      },
    },
    select: { id: true, latitude: true, longitude: true, createdAt: true },
    orderBy: {
      createdAt: "desc",
    },
  });
}
