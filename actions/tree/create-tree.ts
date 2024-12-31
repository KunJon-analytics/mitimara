"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { CreateTreeSchema, createTreeSchema } from "@/lib/validations/tree";

export async function createTree(params: CreateTreeSchema) {
  const validatedFields = createTreeSchema.safeParse(params);

  if (!validatedFields.success) {
    return { error: "Invalid params!", success: false };
  }

  const { accessToken, latitude, longitude } = validatedFields.data;

  try {
    const user = await prisma.user.findFirst({
      where: { accessToken },
      select: { id: true },
    });
    if (!user) {
      return { error: "Unauthenticated!", success: false };
    }

    const tree = await prisma.tree.create({
      data: {
        latitude,
        longitude,
        planterId: user.id,
      },
    });

    revalidatePath("/app");
    return { success: true, treeId: tree.id };
  } catch (error) {
    console.error("Failed to create tree:", error);
    return { success: false, error: "Failed to create tree" };
  }
}
