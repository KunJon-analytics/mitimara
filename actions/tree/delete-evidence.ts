"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { deleteEvidenceSchema } from "@/lib/validations/tree";

export async function deleteTreeEvidence(params: unknown) {
  const validatedFields = deleteEvidenceSchema.safeParse(params);

  if (!validatedFields.success) {
    return { error: "Invalid params!", success: false };
  }

  const { accessToken, evidenceId } = validatedFields.data;

  try {
    const planter = await prisma.user.findFirst({
      where: { accessToken },
      select: { id: true },
    });
    if (!planter) {
      return { error: "Unauthorized!", success: false };
    }

    // ensure media evidence belongs to a tree with no verification
    // and user is tree planter
    const deletedEvidence = await prisma.media.delete({
      where: {
        id: evidenceId,
        tree: { planterId: planter.id, verifications: { none: {} } },
      },
      select: { id: true },
    });

    revalidatePath("/app");

    return { success: true, evidenceId: deletedEvidence.id };
  } catch (error) {
    console.error("Failed to delete tree evidence:", error);
    return { success: false, error: "Failed to delete tree evidence" };
  }
}
