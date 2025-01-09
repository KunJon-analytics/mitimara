"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { treeEvidenceSchema } from "@/lib/validations/tree";
import { treeLogicConfig } from "@/config/site";
import { inngest } from "@/inngest/client";

export async function addTreeEvidence(params: unknown) {
  const validatedFields = treeEvidenceSchema.safeParse(params);

  if (!validatedFields.success) {
    return { error: "Invalid params!", success: false };
  }

  const { accessToken, url, treeId, type, handle } = validatedFields.data;

  try {
    const planter = await prisma.user.findFirst({
      where: { accessToken },
      select: { id: true },
    });
    if (!planter) {
      return { error: "Unauthorized!", success: false };
    }

    // ensure tree is planted by user, has no verifications
    // and media evidence is not more than 3

    const treeEvidences = await prisma.tree.findUnique({
      where: {
        id: treeId,
        planterId: planter.id,
        verifications: {
          none: {},
        },
      },
      select: { _count: { select: { mediaEvidence: true } } },
    });

    if (!treeEvidences) {
      return { error: "Unauthorized!", success: false };
    }

    if (
      treeEvidences._count.mediaEvidence >= treeLogicConfig.maxNoOfTreeEvidences
    ) {
      return { error: "Forbidden!", success: false };
    }

    const createdEvidence = await prisma.media.create({
      data: { url, treeId, type, handle },
      select: { id: true },
    });

    // send tree evidence added event (send TG message)
    await inngest.send({
      name: "tree/evidence.added",
      data: {
        evidenceId: createdEvidence.id,
      },
    });

    revalidatePath("/app");

    return { success: true, treeId: createdEvidence.id };
  } catch (error) {
    console.error("Failed to add tree evidence:", error);
    return { success: false, error: "Failed to add tree evidence" };
  }
}
