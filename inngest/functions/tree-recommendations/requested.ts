import { generateObject } from "ai";

import { inngest } from "@/inngest/client";
import {
  getClimateZone,
  getRecommendedTreeImage,
  recommendationSchema,
} from "@/inngest/utils/recommend-tree";
import prisma from "@/lib/prisma";
import { recAgentModel } from "@/ai/utils/model";

export const treeRecommendationRequested = inngest.createFunction(
  { id: "process-tree-recommendation" },
  { event: "tree.recommendation.requested" },
  async ({ event, step }) => {
    const { latitude, longitude, requestId } = event.data;

    try {
      // Get climate zone and soil information
      const climateZone = await step.run("get-climate-zone", async () => {
        return getClimateZone(latitude, longitude);
      });

      // Use AI to generate a tree recommendation
      const prompt = `As a tree expert, I need a recommendation for a tree species to plant at the following location:
        - Latitude: ${latitude}
        - Longitude: ${longitude}
        - Climate Zone: ${climateZone}
        - Soil Type: Mixed soil types common in the region.

        Please recommend a tree species that is:
        1. Native or well-adapted to this region
        2. Suitable for the soil type and climate
        3. Beneficial for the local ecosystem
        4. Relatively easy to grow and maintain`;

      const { object: treeData } = await step.run(
        "get-ai-generated-recommendation",
        async () => {
          return generateObject({
            model: recAgentModel,
            prompt,
            schema: recommendationSchema,
          });
        }
      );

      // Save the recommendation to the database
      const updatedRecommendation = await step.run(
        "save-recommendation",
        async () => {
          const recommendedTree = await prisma.treeRecommendation.update({
            where: { requestId },
            data: {
              status: "COMPLETED",
              ...treeData,
            },
            select: { id: true, commonName: true },
          });
          return recommendedTree;
        }
      );

      if (!!updatedRecommendation.commonName) {
        // Try to find an image for this tree species
        const imageUrl = await step.run("find-tree-species-image", async () => {
          return getRecommendedTreeImage(updatedRecommendation.commonName!);
        });

        // Update image url for recommended tree if there is
        if (imageUrl) {
          await step.run("update-recommended-tree-image", async () => {
            return prisma.treeRecommendation.update({
              where: { requestId },
              data: { imageUrl },
              select: { id: true, imageUrl: true },
            });
          });
        }

        // Find local nurseries (this would ideally use a Maps API)
      }

      // Send completion event
      // await step.run("send-completion-event", () =>
      //   inngest.send({
      //     name: "tree.recommendation.completed",
      //     data: {
      //       requestId,
      //       treeId: updatedRecommendation.id,
      //     },
      //   })
      // );

      // Create a user activity log entry
      // await step.run("log-activity", () =>
      //   prisma.userActivity.create({
      //     data: {
      //       userId,
      //       type: "TREE_RECOMMENDATION_COMPLETED",
      //       details: `Tree recommendation for ${recommendation.species} is ready`,
      //       date: new Date(),
      //     },
      //   })
      // );

      return { success: true, treeId: updatedRecommendation.id };
    } catch (error) {
      console.error("Error processing tree recommendation:", error);

      // Update the recommendation status to failed
      await step.run("mark-as-failed", () =>
        prisma.treeRecommendation.update({
          where: { requestId },
          data: {
            status: "FAILED",
            error: error instanceof Error ? error.message : "Unknown error",
          },
        })
      );

      // Send failure event
      // await step.run("send-failure-event", () =>
      //   inngest.send({
      //     name: "tree.recommendation.failed",
      //     data: {
      //       requestId,
      //       error: error instanceof Error ? error.message : "Unknown error",
      //     },
      //   })
      // );

      return {
        success: false,
        error: "Failed to generate tree recommendation",
      };
    }
  }
);
