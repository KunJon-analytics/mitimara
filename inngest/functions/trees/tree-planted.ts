import { format } from "date-fns";

import { siteConfig, treeLogicConfig } from "@/config/site";
import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma";

export const treePlantedEvent = inngest.createFunction(
  { id: "tree-planted" },
  { event: "tree/tree.planted" },
  async ({ event, step }) => {
    const { treeId: id } = event.data;

    // get new tree
    const newTree = await step.run("get-planted-tree", async () => {
      return prisma.tree.findUnique({
        where: {
          id,
        },
        select: {
          planterId: true,
          createdAt: true,
          latitude: true,
          longitude: true,
        },
      });
    });

    // return if no tree
    if (!newTree) {
      return { message: "Invalid Tree" };
    }

    //  reduce planter points
    const updatedPlanter = await step.run("reduce-planter-points", async () => {
      return prisma.user.update({
        where: {
          id: newTree.planterId,
        },
        select: {
          username: true,
        },
        data: { points: { decrement: treeLogicConfig.minPlanterPoints } },
      });
    });

    // send TG Admin message for new tree
    const message = `<b>🌳 New Tree Planted!</b
    
Planted by <b>${updatedPlanter.username}</b>!
Coordinates:  <b>${newTree.latitude.toFixed(6)}, ${newTree.longitude.toFixed(
      6
    )}</b>!

Thank you for contributing to a greener planet with ${siteConfig.name}!
`;

    await step.sendEvent("send-tree-planted-notification", {
      name: "notifications/telegram.send",
      data: { message, type: "BROADCAST" },
    });

    // return

    return { message: `New tree: ${id} added!!!` };
  }
);
