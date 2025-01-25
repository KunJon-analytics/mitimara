"use server";

import { revalidatePath } from "next/cache";

import { treeLogicConfig } from "@/config/site";
import { prisma } from "@/lib/prisma";
import { treeVerificationSchema } from "@/lib/validations/tree";
import { inngest } from "@/inngest/client";
import { isValidAccessToken } from "@/lib/pi/platform-api-client";
import { checkVerificationComplete } from "@/lib/tree/is-verification-complete";

export async function submitVerification(params: unknown) {
  const validatedFields = treeVerificationSchema.safeParse(params);

  if (!validatedFields.success) {
    return { success: false, error: "Invalid Params" };
  }

  const { accessToken, isAuthentic, treeId, type, url, additionalInfo, code } =
    validatedFields.data;

  const validToken = await isValidAccessToken(accessToken);
  if (!validToken) {
    console.error("Failed to submit verification:", "Invalid Access Token");
    return { error: "Unauthorized!", success: false };
  }

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

    const selectedTree = await prisma.tree.update({
      where: {
        id: treeId,
        status: { in: ["LISTED", "VERIFYING"] },
        code,
        planterId: { not: user.id },
        verifications: { none: { verifierId: user.id } },
      },
      data: { status: "VERIFYING" },
      select: {
        verifications: { select: { treeIsAuthentic: true } },
      },
    });

    // check if verification completed

    const submissions = selectedTree.verifications.map(
      (verif) => verif.treeIsAuthentic
    );
    const newSubmission = isAuthentic;

    const verificationResult = checkVerificationComplete(
      submissions,
      newSubmission
    );

    // if verification complete add date verified to tree,
    // isauthentic and change status

    if (verificationResult.status === "complete") {
      await prisma.tree.update({
        where: { id: treeId },
        data: {
          isAuthentic: verificationResult.result,
          dateVerified: new Date(),
          status: "VERIFIED",
        },
      });
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
