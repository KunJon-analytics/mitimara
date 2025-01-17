"use server";

import { revalidatePath } from "next/cache";

import { treeLogicConfig } from "@/config/site";
import { prisma } from "@/lib/prisma";
import { treeVerificationSchema } from "@/lib/validations/tree";
import { treeVerified } from "@/lib/tree/utils";
import { inngest } from "@/inngest/client";

export async function submitVerification(params: unknown) {
  const validatedFields = treeVerificationSchema.safeParse(params);

  if (!validatedFields.success) {
    return { success: false, error: "Invalid Params" };
  }

  const { accessToken, isAuthentic, treeId, type, url, additionalInfo, code } =
    validatedFields.data;
  try {
    const user = await prisma.user.findFirst({
      where: {
        accessToken,
        points: { gte: treeLogicConfig.minVerifierPoints },
      },
      select: { id: true },
    });

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const selectedTree = await prisma.tree.findUnique({
      where: {
        id: treeId,
        dateVerified: null,
        code,
        planterId: { not: user.id },
        verifications: { none: { verifierId: user.id } },
      },
      select: {
        id: true,
        verifications: { select: { treeIsAuthentic: true } },
      },
    });

    if (!selectedTree) {
      return { success: false, error: "Unauthorized" };
    }

    // Check if the tree has reached the maximum number of verifications
    const treeIsVerified = treeVerified(selectedTree);
    if (treeIsVerified) {
      return {
        success: false,
        error: "This tree has already been verified",
      };
    }

    const mediaEvidence = type && url ? { create: { type, url } } : undefined;

    const verification = await prisma.treeVerification.create({
      data: {
        treeId,
        verifierId: user.id,
        mediaEvidence,
        treeIsAuthentic: isAuthentic,
        additionalInfo,
      },
      select: { id: true },
    });

    // send tree verified event
    await inngest.send({
      name: "tree/verification.added",
      data: {
        verificationId: verification.id,
      },
    });

    // revalidate tree and users => planter and verifier (do it here)
    revalidatePath("/app");

    return { success: true, verificationId: verification.id };
  } catch (error) {
    console.error("Failed to submit verification:", error);
    return { success: false, error: "Failed to submit verification" };
  }
}
