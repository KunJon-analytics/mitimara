"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { createTreeSchema } from "@/lib/validations/tree";
import { treeLogicConfig } from "@/config/site";

export async function createTree(params: unknown) {
  const validatedFields = createTreeSchema.safeParse(params);

  if (!validatedFields.success) {
    return { error: "Invalid params!", success: false };
  }

  const { accessToken, latitude, longitude } = validatedFields.data;

  try {
    const user = await prisma.user.findFirst({
      where: { accessToken, points: { gte: treeLogicConfig.minPlanterPoints } },
      select: { id: true },
    });
    if (!user) {
      return { error: "Unauthorized!", success: false };
    }

    const tree = await prisma.tree.create({
      data: {
        latitude,
        longitude,
        planterId: user.id,
      },
    });

    // send tree created event (send TG message, reduce planter points)

    revalidatePath("/app");
    return { success: true, treeId: tree.id };
  } catch (error) {
    console.error("Failed to create tree:", error);
    return { success: false, error: "Failed to create tree" };
  }
}
