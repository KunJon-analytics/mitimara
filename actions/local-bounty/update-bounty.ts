"use server";

import { revalidatePath } from "next/cache";
import { endOfDay, startOfDay } from "date-fns";

import { prisma } from "@/lib/prisma";
import {
  UpdateBountySchema,
  updateBountySchema,
} from "@/lib/validations/local-bounty/update";
import { isValidAccessToken } from "@/lib/pi/platform-api-client";

export async function updateBountyHunt(params: UpdateBountySchema) {
  const validatedFields = updateBountySchema.safeParse(params);

  if (!validatedFields.success) {
    return { error: "Invalid params!", success: false };
  }

  const { id, accessToken, ...data } = validatedFields.data;

  const validToken = await isValidAccessToken(accessToken);
  if (!validToken) {
    console.error("Failed to update local bounty:", "Invalid Access Token");
    return { error: "Unauthorized!", success: false };
  }
  try {
    await prisma.localBounty.update({
      where: {
        id,
        paymentId: null,
        creator: { accessToken },
      },
      data: {
        ...data,
        startDate: startOfDay(data.startDate),
        endDate: endOfDay(data.endDate),
      },
      select: { id: true },
    });

    revalidatePath(`/app/bounty-hunt/${id}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to update bounty hunt:", error);
    return { success: false, error: "Failed to update bounty hunt" };
  }
}
