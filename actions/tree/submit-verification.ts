"use server";

import { prisma } from "@/lib/prisma";

export async function submitVerification(
  treeId: string,
  verifierId: string,
  isAuthentic: boolean,
  videoUrl: string,
  additionalInfo?: string
) {
  try {
    const verification = await prisma.treeVerification.create({
      data: {
        treeId,
        verifierId,
        mediaEvidence: { create: { type: "VIDEO", url: videoUrl } },
        treeIsAuthentic: isAuthentic,
        additionalInfo,
      },
    });

    if (isAuthentic) {
      await prisma.tree.update({
        where: { id: treeId },
        data: {
          isAuthentic: true,
          dateVerified: new Date(),
        },
      });
    }

    return { success: true, verificationId: verification.id };
  } catch (error) {
    console.error("Failed to submit verification:", error);
    return { success: false, error: "Failed to submit verification" };
  }
}
