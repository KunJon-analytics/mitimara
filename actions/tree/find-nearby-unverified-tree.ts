"use server";

import { treeLogicConfig } from "@/config/site";
import { prisma } from "@/lib/prisma";
import { calculateDistance } from "@/lib/utils";
import { createTreeSchema } from "@/lib/validations/tree";

export async function findNearbyUnverifiedTree(params: unknown) {
  const validatedFields = createTreeSchema.safeParse(params);

  if (!validatedFields.success) {
    return null;
  }

  const { accessToken, latitude, longitude } = validatedFields.data;

  try {
    const user = await prisma.user.findFirst({
      where: {
        accessToken,
        points: { gte: treeLogicConfig.minVerifierPoints },
      },
      select: { id: true },
    });

    if (!user) {
      return null;
    }

    const trees = await prisma.tree.findMany({
      where: {
        dateVerified: null,
        planterId: { not: user.id },
        verifications: { none: { verifierId: user.id } },
      },
      select: {
        planter: { select: { username: true } },
        latitude: true,
        longitude: true,
        id: true,
      },
    });

    const nearbyTrees = trees.filter(
      (tree) =>
        calculateDistance(latitude, longitude, tree.latitude, tree.longitude) <=
        2
    );

    return nearbyTrees[0] || null;
  } catch (error) {
    console.error("Failed to find nearby tree:", error);
    return null;
  }
}
