"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { deleteEvidenceSchema } from "@/lib/validations/tree";
import { inngest } from "@/inngest/client";
import { isValidAccessToken } from "@/lib/pi/platform-api-client";
import { verificationNotStartedStatus } from "@/lib/tree/constants";

export async function deleteTreeEvidence(params: unknown) {
  const validatedFields = deleteEvidenceSchema.safeParse(params);

  if (!validatedFields.success) {
    return { error: "Invalid params!", success: false };
  }

  const { accessToken, evidenceId } = validatedFields.data;

  const validToken = await isValidAccessToken(accessToken);
  if (!validToken) {
    console.error("Failed to delete tree evidence:", "Invalid Access Token");
    return { error: "Unauthorized!", success: false };
  }

  try {
    // ensure media evidence belongs to a LISTED or  tree
    // and user is tree planter
    const deletedEvidence = await prisma.media.delete({
      where: {
        id: evidenceId,
        tree: {
          planter: { accessToken },
          status: { in: verificationNotStartedStatus },
        },
      },
      select: {
        id: true,
        handle: true,
        tree: {
          select: { _count: { select: { mediaEvidence: true } }, id: true },
        },
      },
    });

    // if media evidence was equal to 1 change tree status to PLANTED
    if (
      deletedEvidence.tree &&
      deletedEvidence.tree._count.mediaEvidence === 1
    ) {
      await prisma.tree.update({
        where: { id: deletedEvidence.tree.id },
        data: { status: "PLANTED" },
      });
    }

    // send delete uploadthing file if handle present
    if (deletedEvidence.handle) {
      await inngest.send({
        name: "uploadthing/file.delete",
        data: {
          fileHandle: deletedEvidence.handle,
        },
      });
    }

    //invalidate tree here

    revalidatePath("/app");

    return { success: true, evidenceId: deletedEvidence.id };
  } catch (error) {
    console.error("Failed to delete tree evidence:", error);
    return { success: false, error: "Failed to delete tree evidence" };
  }
}
