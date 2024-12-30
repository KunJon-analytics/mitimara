"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

export async function createTree(
  latitude: number,
  longitude: number,
  userId: string
) {
  try {
    const tree = await prisma.tree.create({
      data: {
        latitude,
        longitude,
        planterId: userId,
      },
    });

    revalidatePath("/app");
    return { success: true, treeId: tree.id };
  } catch (error) {
    console.error("Failed to create tree:", error);
    return { success: false, error: "Failed to create tree" };
  }
}
