import { siteConfig } from "@/config/site";
import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma";

export const treeInfoUpdatedEvent = inngest.createFunction(
  { id: "tree-info-updated" },
  { event: "tree/info.updated" },
  async ({ event, step }) => {
    const { treeId: id } = event.data;

    // get updated tree
    const updatedTree = await step.run("get-updated-tree", async () => {
      return prisma.tree.findUnique({
        where: {
          id,
        },
        select: {
          planter: { select: { username: true } },
          updatedAt: true,
          additionalInfo: true,
        },
      });
    });

    // return if no tree
    if (!updatedTree) {
      return { message: "Invalid Tree" };
    }

    // use AI to check for NSFW

    // send TG Admin message for updated tree info
    const message = `<b>Tree Information Updated!</b>
    
🌳 Tree updated by <b>${updatedTree.planter.username}</b>.

New Information: <b>${updatedTree.additionalInfo || ""}</b>

Thank you for keeping our records accurate and contributing to a greener planet with ${
      siteConfig.name
    }!

`;

    await step.sendEvent("send-updated-tree-info-notification", {
      name: "notifications/telegram.send",
      data: { message, type: "BROADCAST" },
    });

    // return

    return { message: `Tree: ${id} info updated!!!` };
  }
);
