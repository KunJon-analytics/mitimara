import { siteConfig } from "@/config/site";
import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma";
import { readPolicy } from "@/lib/services/filestack-policy";
import { getImageUrlWithPolicy } from "@/lib/utils";

export const newEvidenceEvent = inngest.createFunction(
  { id: "new-tree-evidence-added" },
  { event: "tree/evidence.added" },
  async ({ event, step }) => {
    const { evidenceId } = event.data;

    // get evidence
    const treeEvidence = await step.run("get-added-evidence", async () => {
      return prisma.media.findUnique({
        where: {
          id: evidenceId,
        },
        select: {
          url: true,
          id: true,
          type: true,
          tree: { select: { planter: { select: { username: true } } } },
        },
      });
    });

    // return if no evidence
    if (!treeEvidence) {
      return { message: "Invalid Evidence" };
    }

    // use AI to check for NSFW or plagiarism

    // send TG Admin message for new evidence
    const evidenceUrl =
      treeEvidence.type === "VIDEO"
        ? treeEvidence.url
        : getImageUrlWithPolicy(treeEvidence.url, readPolicy);
    const message = `<b>New Media Evidence Added!</b>

A new tree <b>${treeEvidence.type.toLowerCase()}</b> has been added by ${
      treeEvidence.tree?.planter.username || "the planter"
    }.
<a href='${evidenceUrl}'>View Evidence</a>

Thank you for contributing to a greener planet with ${siteConfig.name}!
`;

    await step.sendEvent("send-new-evidence-notification", {
      name: "notifications/telegram.post",
      data: { message, type: "BROADCAST" },
    });

    // return

    return { message: `New evidence: ${treeEvidence.id} added!!!` };
  }
);
