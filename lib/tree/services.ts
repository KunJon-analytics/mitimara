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
