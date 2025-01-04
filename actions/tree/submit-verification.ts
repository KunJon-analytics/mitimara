"use server";

import { treeLogicConfig } from "@/config/site";
import { prisma } from "@/lib/prisma";
import {
  treeVerificationSchema,
  TreeVerificationSchema,
} from "@/lib/validations/tree";

export async function submitVerification(params: TreeVerificationSchema) {
  const validatedFields = treeVerificationSchema.safeParse(params);

  if (!validatedFields.success) {
    return { success: false, error: "Invalid Params" };
  }

  const { accessToken, isAuthentic, treeId, type, url, additionalInfo } =
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
        planterId: { not: user.id },
        verifications: { none: { verifierId: user.id } },
      },
      select: { id: true },
    });

    if (!selectedTree) {
      return { success: false, error: "Unauthorized" };
    }

    const verification = await prisma.treeVerification.create({
      data: {
        treeId,
        verifierId: user.id,
        mediaEvidence: { create: { type, url } },
        treeIsAuthentic: isAuthentic,
        additionalInfo,
      },
    });

    // revalidate tree and users => planter and verifier (do it here)

    // send event to check if tree is now verified, subtract points,

    return { success: true, verificationId: verification.id };
  } catch (error) {
    console.error("Failed to submit verification:", error);
    return { success: false, error: "Failed to submit verification" };
  }
}
