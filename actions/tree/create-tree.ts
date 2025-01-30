"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { createTreeSchema } from "@/lib/validations/tree";
import { treeLogicConfig } from "@/config/site";
import { inngest } from "@/inngest/client";
import { isValidAccessToken } from "@/lib/pi/platform-api-client";
import { isWithinEvent } from "@/lib/local-bounty/utils";

export async function createTree(params: unknown) {
  const validatedFields = createTreeSchema.safeParse(params);

  if (!validatedFields.success) {
    return { error: "Invalid params!", success: false };
  }

  const { accessToken, latitude, longitude, localBountyId } =
    validatedFields.data;

  const validToken = await isValidAccessToken(accessToken);
  if (!validToken) {
    console.error("Failed to create tree:", "Invalid Access Token");
    return { error: "Unauthorized!", success: false };
  }

  try {
    const user = await prisma.user.findFirst({
      where: { accessToken, points: { gte: treeLogicConfig.minPlanterPoints } },
      select: { id: true },
    });
    if (!user) {
      return { error: "Unauthorized!", success: false };
    }

    if (!!localBountyId) {
      const now = new Date();
      const localBounty = await prisma.localBounty.findUnique({
        where: {
          id: localBountyId,
          paymentId: { not: null },
          startDate: { lte: now },
          endDate: { gte: now },
        },
        select: { centerLatitude: true, centerLongitude: true, radius: true },
      });
      if (
        !localBounty ||
        !isWithinEvent({
          eventLat: localBounty.centerLatitude,
          eventLng: localBounty.centerLongitude,
          eventRadius: localBounty.radius,
          userLat: latitude,
          userLng: longitude,
        }).withinEvent
      ) {
        return { error: "Unauthorized!", success: false };
      }
    }

    const treePlanter = await prisma.user.update({
      where: { id: user.id },
      data: {
        points: { decrement: treeLogicConfig.minPlanterPoints },
        plantedTrees: {
          create: {
            latitude,
            longitude,
            status: "PLANTED",
            localBountyId,
          },
        },
      },
      select: {
        plantedTrees: {
          orderBy: { createdAt: "desc" },
          select: { id: true },
          take: 1,
        },
      },
    });

    const createdTree = treePlanter.plantedTrees[0];

    // send tree planted event (send TG message)
    await inngest.send({
      name: "tree/tree.planted",
      data: {
        treeId: createdTree.id,
      },
    });

    revalidatePath("/app");
    return { success: true, treeId: createdTree.id };
  } catch (error) {
    console.error("Failed to create tree:", error);
    return { success: false, error: "Failed to create tree" };
  }
}
