"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  RewardUserParams,
  rewardUserParams,
} from "@/lib/validations/admin/reward-user";
import { isValidAccessToken } from "@/lib/pi/platform-api-client";
import { isAdmin } from "@/lib/validations/admin/is-admin";

export async function rewardUser(params: RewardUserParams) {
  const validatedFields = rewardUserParams.safeParse(params);

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

    // Get the user
    const user = await prisma.user.findUnique({
      where: { id: input.userId },
      select: { points: true, policingPoints: true, id: true },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    // Calculate the new points value
    const pointsChange =
      input.action === "reward" ? input.amount : -input.amount;

    // Update the user's points
    if (input.pointType === "ecosystem") {
      // Ensure points don't go below 0
      const newPoints = Math.max(0, user.points + pointsChange);

      await prisma.user.update({
        where: { id: input.userId },
        data: { points: newPoints },
      });
    } else {
      // Ensure policing points don't go below 0
      const newPolicingPoints = Math.max(0, user.policingPoints + pointsChange);

      await prisma.user.update({
        where: { id: input.userId },
        data: { policingPoints: newPolicingPoints },
      });
    }

    // Log the action in an audit log (you might want to create a model for this)
    await prisma.adminLogAction.create({
      data: {
        action: `${input.action}_${input.amount}_${input.pointType}_points_for_${user.id}`,
        reason: input.reason,
        admin: currentUser?.username, // You would get this from your auth system
      },
    });

    // Revalidate the user's page
    revalidatePath(`/app/admin/users/${input.userId}/reward`);

    return { success: true };
  } catch (error) {
    console.error("Error rewarding user:", error);
    return { success: false, error: "Failed to update user points" };
  }
}
