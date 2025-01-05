"use server";

import { prisma } from "@/lib/prisma";
import { EditTreeInfoSchema, editTreeInfoSchema } from "@/lib/validations/tree";

export async function editTreeInfo(params: EditTreeInfoSchema) {
  const validatedFields = editTreeInfoSchema.safeParse(params);

  if (!validatedFields.success) {
    return { success: false, error: "Invalid Params" };
  }

  const { accessToken, treeId: id, additionalInfo } = validatedFields.data;
  try {
    const user = await prisma.user.findFirst({
      where: {
        accessToken,
      },
      select: { id: true },
    });

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const selectedTree = await prisma.tree.findUnique({
      where: {
        id,
        dateVerified: null,
        planterId: user.id,
        verifications: { none: {} },
      },
      select: { id: true },
    });

    if (!selectedTree) {
      return { success: false, error: "Unauthorized" };
    }

    const updatedTree = await prisma.tree.update({
      data: {
        additionalInfo,
      },
      where: { id },
      select: { id: true },
    });

    // revalidate tree and users => planter (do it here)

    // send updatedinfo event to send tg message

    return { success: true, updatedTreeId: updatedTree.id };
  } catch (error) {
    console.error("Failed to update tree:", error);
    return { success: false, error: "Failed to update tree" };
  }
}
