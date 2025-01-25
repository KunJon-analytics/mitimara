"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { editTreeInfoSchema } from "@/lib/validations/tree";
import { inngest } from "@/inngest/client";
import { isValidAccessToken } from "@/lib/pi/platform-api-client";
import { verificationNotStartedStatus } from "@/lib/tree/constants";

export async function editTreeInfo(params: unknown) {
  const validatedFields = editTreeInfoSchema.safeParse(params);

  if (!validatedFields.success) {
    return { success: false, error: "Invalid Params" };
  }

  const { accessToken, treeId: id, additionalInfo } = validatedFields.data;

  const validToken = await isValidAccessToken(accessToken);
  if (!validToken) {
    console.error("Failed to update tree info:", "Invalid Access Token");
    return { error: "Unauthorized!", success: false };
  }

  try {
    //only update LISTED/PUBLIC tree by planter
    const updatedTree = await prisma.tree.update({
      where: {
        id,
        planter: { accessToken },
        status: { in: verificationNotStartedStatus },
      },
      data: { additionalInfo },
      select: { id: true },
    });

    // send updatedinfo event to send tg message
    await inngest.send({
      name: "tree/info.updated",
      data: {
        treeId: updatedTree.id,
      },
    });

    // revalidate tree and users => planter (do it here)
    revalidatePath("/app");

    return { success: true, updatedTreeId: updatedTree.id };
  } catch (error) {
    console.error("Failed to update tree info:", error);
    return { success: false, error: "Failed to update tree" };
  }
}
