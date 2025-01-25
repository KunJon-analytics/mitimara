"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { createTreeSchema } from "@/lib/validations/tree";
import { treeLogicConfig } from "@/config/site";
import { inngest } from "@/inngest/client";
import { isValidAccessToken } from "@/lib/pi/platform-api-client";

export async function createTree(params: unknown) {
  const validatedFields = createTreeSchema.safeParse(params);

  if (!validatedFields.success) {
    return { error: "Invalid params!", success: false };
  }

  const { accessToken, latitude, longitude } = validatedFields.data;

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

    const treePlanter = await prisma.user.update({
      where: { id: user.id },
      data: {
        points: { decrement: treeLogicConfig.minPlanterPoints },
        plantedTrees: {
          create: {
            latitude,
            longitude,
            status: "PLANTED",
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
