"use server";

import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";

import { prisma } from "@/lib/prisma";
import { createTreeSchema, CreateTreeSchema } from "@/lib/validations/tree";
import { isValidAccessToken } from "@/lib/pi/platform-api-client";
import { TREE_RECOMMENDATION_COST } from "@/config/site";
import { inngest } from "@/inngest/client";

export async function recommendTree(params: CreateTreeSchema) {
  const validatedFields = createTreeSchema.safeParse(params);

  if (!validatedFields.success) {
    return { error: "Invalid params!", success: false };
  }

  const { accessToken, latitude, longitude } = validatedFields.data;

  const validToken = await isValidAccessToken(accessToken);
  if (!validToken) {
    console.error("Failed to recommend tree:", "Invalid Access Token");
    return { error: "Unauthorized!", success: false };
  }

  try {
    const currentUser = await prisma.user.findFirst({
      where: { accessToken },
      select: { id: true, points: true },
    });

    if (!currentUser) {
      return {
        success: false,
        error: "You must be logged in to get tree recommendations",
      };
    }

    if (currentUser.points < TREE_RECOMMENDATION_COST) {
      return {
        success: false,
        error: `You need ${TREE_RECOMMENDATION_COST} points for a recommendation. You currently have ${currentUser.points} points.`,
      };
    }

    // reduce user points
    await prisma.user.update({
      where: { id: currentUser.id },
      data: { points: { decrement: TREE_RECOMMENDATION_COST } },
    });

    // Create a unique request ID
    const requestId = uuidv4();

    // Create a pending recommendation record
    const recommendation = await prisma.treeRecommendation.create({
      data: {
        userId: currentUser.id,
        requestId,
        status: "PENDING",
        latitude,
        longitude,
      },
      select: { latitude: true, longitude: true, requestId: true },
    });

    // Create a user activity log entry
    // await prisma.userActivity.create({
    //   data: {
    //     userId: currentUser.id,
    //     type: "TREE_RECOMMENDATION_REQUESTED",
    //     details: `Used ${SITE_CONSTANTS.TREE_RECOMMENDATION_COST} points for a tree recommendation`,
    //     date: new Date(),
    //   },
    // });

    // Send event to Inngest to process the recommendation in the background
    await inngest.send({
      name: "tree.recommendation.requested",
      data: recommendation,
    });

    revalidatePath("/app");

    return {
      success: true,
      message: "Your tree recommendation is being processed",
      requestId,
    };
  } catch (error) {
    console.error("Error recommending tree:", error);
    return {
      success: false,
      error: "Failed to request tree recommendation",
    };
  }
}
