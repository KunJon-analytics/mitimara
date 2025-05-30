"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { treeEvidenceSchema } from "@/lib/validations/tree";
import { treeLogicConfig } from "@/config/site";
import { inngest } from "@/inngest/client";
import { isValidAccessToken } from "@/lib/pi/platform-api-client";
import { verificationNotStartedStatus } from "@/lib/tree/constants";

export async function addTreeEvidence(params: unknown) {
  const validatedFields = treeEvidenceSchema.safeParse(params);

  if (!validatedFields.success) {
    return { error: "Invalid params!", success: false };
  }

  const { accessToken, url, treeId, type, handle } = validatedFields.data;

  const validToken = await isValidAccessToken(accessToken);
  if (!validToken) {
    console.error("Failed to add tree evidence:", "Invalid Access Token");
    return { error: "Unauthorized!", success: false };
  }

  try {
    // ensure tree is planted by user, is LISTED or PLANTED
    //  and media evidence is not more than 3
    const tree = await prisma.tree.findUnique({
      where: {
        id: treeId,
        status: { in: verificationNotStartedStatus },
        planter: { accessToken },
      },
      select: { _count: { select: { mediaEvidence: true } } },
    });

    if (!tree) {
      return { error: "Unauthorized!", success: false };
    }

    if (tree._count.mediaEvidence >= treeLogicConfig.maxNoOfTreeEvidences) {
      // if evidence type is image send delete image from uploadthing
      return { error: "Forbidden!", success: false };
    }

    // create media and update tree to listed

    const updatedTreeWithEvidence = await prisma.tree.update({
      where: { id: treeId },
      data: {
        status: "LISTED",
        mediaEvidence: { create: { type, url, handle } },
      },
      select: { mediaEvidence: { select: { url: true, id: true } } },
    });

    const createdEvidence = updatedTreeWithEvidence.mediaEvidence.find(
      (mE) => mE.url === url
    );

    if (!createdEvidence) {
      // if created evidence
      return { error: "Server error!", success: false };
    }

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
