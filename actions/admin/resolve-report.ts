"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import {
  ResolutionFormValues,
  resolutionFormSchema,
} from "@/lib/validations/tree";
import { isValidAccessToken } from "@/lib/pi/platform-api-client";
import { isAdmin } from "@/lib/validations/admin/is-admin";
import { inngest } from "@/inngest/client";

export async function resolveReport(params: ResolutionFormValues) {
  const validatedFields = resolutionFormSchema.safeParse(params);

  if (!validatedFields.success) {
    return { error: "Invalid params", success: false };
  }

  const { accessToken, ...input } = validatedFields.data;

  const validToken = await isValidAccessToken(accessToken);

  if (!validToken) {
    console.error("Error rewarding user:", "Invalid Access Token");
    return { error: "Unauthorized", success: false };
  }

  try {
    // Verify the current user is an admin
    const currentUser = await prisma.user.findFirst({
      where: { accessToken },
      select: { username: true },
    });

    const isAdminUser = isAdmin(currentUser?.username);
    if (!isAdminUser || !currentUser) {
      return { success: false, error: "Unauthorized" };
    }

    // Get the report with related data
    const report = await prisma.treeReport.findUnique({
      where: { id: input.reportId },
      include: {
        tree: {
          include: {
            planter: true,
            verifications: {
              include: {
                verifier: true,
              },
            },
          },
        },
        reporter: true,
      },
    });

    if (!report) {
      return { success: false, error: "Report not found" };
    }

    if (report.status !== "PENDING") {
      return { success: false, error: "This report has already been resolved" };
    }

    // update report status

    await prisma.treeReport.update({
      where: { id: input.reportId },
      data: {
        status: input.resolution,
        resolver: currentUser.username,
      },
      select: { id: true },
    });

    // send report resolved event
    await inngest.send({
      name: "tree/report.resolved",
      data: {
        notes: input.notes,
        reportId: input.reportId,
      },
    });

    revalidatePath(`/app/reports/${input.reportId}`);

    return { success: true };
  } catch (error) {
    console.error("Error resolving report:", error);
    return { success: false, error: "Failed to resolve report" };
  }
}
