"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import {
  treeReportFormSchema,
  TreeReportFormSchema,
} from "@/lib/validations/tree";
import { isValidAccessToken } from "@/lib/pi/platform-api-client";
import { inngest } from "@/inngest/client";
import { MIN_POLICING_POINTS } from "@/config/site";

export async function createTreeReport(params: TreeReportFormSchema) {
  const validatedFields = treeReportFormSchema.safeParse(params);

  if (!validatedFields.success) {
    return { error: "Invalid params!", success: false };
  }

  const { accessToken, ...input } = validatedFields.data;

  const validToken = await isValidAccessToken(accessToken);
  if (!validToken) {
    console.error("Failed to add tree evidence:", "Invalid Access Token");
    return { error: "Unauthorized!", success: false };
  }
  try {
    const currentUser = await prisma.user.findFirst({
      where: { accessToken },
      select: { id: true, policingPoints: true, username: true },
    });
    if (!currentUser) {
      return {
        success: false,
        error: "You must be logged in to report a tree",
      };
    }

    // Get the tree
    const tree = await prisma.tree.findUnique({
      where: { id: input.treeId, status: "MATURED" },
      select: {
        isAuthentic: true,
        planter: {
          select: {
            id: true,
          },
        },
        verifications: {
          select: {
            verifierId: true,
          },
        },
        report: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!tree) {
      return { success: false, error: "Tree not found" };
    }

    // Check if the tree has already been reported
    if (tree.report) {
      return { success: false, error: "Tree has already been reported" };
    }

    // Check if the user has enough policing points
    if (currentUser.policingPoints < MIN_POLICING_POINTS) {
      return { success: false, error: "You don't have enough policing points" };
    }

    // For real trees (user wants to report as fake)
    if (tree.isAuthentic) {
      // Check if the user is the planter or a verifier
      const isPlanter = tree.planter.id === currentUser.id;
      const isVerifier = tree.verifications.some(
        (v) => v.verifierId === currentUser.id
      );

      if (isPlanter || isVerifier) {
        return {
          success: false,
          error: "You cannot report a tree you planted or verified",
        };
      }
    }
    // For fake trees (planter wants to contest)
    else {
      // Only the planter can contest a fake tree
      const isPlanter = tree.planter.id === currentUser.id;

      if (!isPlanter) {
        return {
          success: false,
          error: "Only the tree planter can contest a tree marked as fake",
        };
      }
    }

    // Send new report event

    await inngest.send({
      name: "tree/tree.reported",
      data: {
        ...input,
        reporterId: currentUser.id,
      },
    });

    revalidatePath(`/app/tree/${input.treeId}`);

    return { success: true };
  } catch (error) {
    console.error("Error creating tree report:", error);
    return { success: false, error: "Failed to submit report" };
  }
}
