"use server";

import { revalidatePath } from "next/cache";
import { endOfDay, startOfDay } from "date-fns";

import { localBountyLogicConfig } from "@/config/site";
import { isValidAccessToken } from "@/lib/pi/platform-api-client";
import prisma from "@/lib/prisma";
import {
  CreateBountySchema,
  createBountySchema,
} from "@/lib/validations/local-bounty/create";

export const createBounty = async (params: CreateBountySchema) => {
  const validatedFields = createBountySchema.safeParse(params);

  if (!validatedFields.success) {
    return { error: "Invalid params!", success: false };
  }

  const { accessToken, ...rest } = validatedFields.data;

  const validToken = await isValidAccessToken(accessToken);
  if (!validToken) {
    console.error("Failed to create local bounty:", "Invalid Access Token");
    return { error: "Unauthorized!", success: false };
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        accessToken,
        points: { gte: localBountyLogicConfig.minCreatorPoints },
      },
      select: { id: true },
    });
    if (!user) {
      return { error: "Unauthorized!", success: false };
    }

    const localbountyCreator = await prisma.user.update({
      where: { id: user.id },
      data: {
        points: { decrement: localBountyLogicConfig.minCreatorPoints },
        createdBounties: {
          create: {
            ...rest,
            startDate: startOfDay(rest.startDate),
            endDate: endOfDay(rest.endDate),
          },
        },
      },
      select: {
        createdBounties: {
          orderBy: { createdAt: "desc" },
          select: { id: true },
          take: 1,
        },
      },
    });

    const createdLocalBounty = localbountyCreator.createdBounties[0];

    revalidatePath("/app");
    return { success: true, localBountyId: createdLocalBounty.id };
  } catch (error) {
    console.error("Failed to create local bounty:", error);
    return { success: false, error: "Failed to create local bounty" };
  }
};
