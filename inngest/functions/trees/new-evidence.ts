import { siteConfig } from "@/config/site";
import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma";

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
    const message = `<b>New Media Evidence Added!</b>

<p>A new <b>${treeEvidence.type.toLowerCase()}</b> has been added to the tree by @${
      treeEvidence.tree?.planter || "the planter"
    }.</p>
<p>Check out the evidence: <a href=${treeEvidence.url}>View Evidence</a></p>

<p>Thank you for contributing to a greener planet with ${siteConfig.name}!</p>
`;

    await step.sendEvent("send-new-evidence-notification", {
      name: "notifications/telegram.send",
      data: { message, type: "BROADCAST" },
    });

    // return

    return { message: `New evidence: ${treeEvidence.id} added!!!` };
  }
);
