"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import {
  DeleteBountySchema,
  deleteBountySchema,
} from "@/lib/validations/local-bounty/update";
import { isValidAccessToken } from "@/lib/pi/platform-api-client";

export async function deleteBountyHunt(params: DeleteBountySchema) {
  const validatedFields = deleteBountySchema.safeParse(params);

  if (!validatedFields.success) {
    return { error: "Invalid params!", success: false };
  }

  const { id, accessToken } = validatedFields.data;

  const validToken = await isValidAccessToken(accessToken);
  if (!validToken) {
    console.error("Failed to delete local bounty:", "Invalid Access Token");
    return { error: "Unauthorized!", success: false };
  }
  try {
    await prisma.localBounty.delete({
      where: {
        id,
        paymentId: null,
        creator: { accessToken },
      },
      select: { id: true },
    });

    revalidatePath(`/app`);
    return { success: true };
  } catch (error) {
    console.error("Failed to delete bounty hunt:", error);
    return { success: false, error: "Failed to delete bounty hunt" };
  }
}
