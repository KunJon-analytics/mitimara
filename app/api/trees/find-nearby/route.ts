import { NextRequest } from "next/server";

import { createTreeSchema } from "@/lib/validations/tree";
import prisma from "@/lib/prisma";
import { treeLogicConfig } from "@/config/site";
import { calculateDistance } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const latString = sp.get("lat");
  const lngString = sp.get("lng");
  const params = {
    accessToken: sp.get("token"),
    latitude: latString ? parseFloat(latString) : null,
    longitude: lngString ? parseFloat(lngString) : null,
  };

  const validatedFields = createTreeSchema.safeParse(params);

  if (!validatedFields.success) {
    return Response.json(null);
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
      return Response.json(null);
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
        mediaEvidence: { select: { type: true, url: true } },
      },
    });

    const nearbyTrees = trees.filter(
      (tree) =>
        calculateDistance(latitude, longitude, tree.latitude, tree.longitude) <=
        treeLogicConfig.maxVerifierDistance
    );

    return nearbyTrees[0] || null;
  } catch (error) {
    console.error("Failed to find nearby tree:", error);
    return Response.json(null);
  }
}
