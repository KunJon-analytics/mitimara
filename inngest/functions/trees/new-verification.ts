import { siteConfig } from "@/config/site";
import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma";
import { isTreeVerficationEnded } from "@/lib/tree/utils";

export const treeVerificationAddedEvent = inngest.createFunction(
  { id: "tree-verification-added" },
  { event: "tree/verification.added" },
  async ({ event, step }) => {
    const { verificationId } = event.data;

    // get verification
    const newVerification = await step.run(
      "get-tree-verification",
      async () => {
        return prisma.treeVerification.findUnique({
          where: {
            id: verificationId,
            tree: { status: { in: ["VERIFIED", "VERIFYING"] } },
          },
          select: {
            verifier: { select: { username: true } },
            additionalInfo: true,
            treeIsAuthentic: true,
            tree: {
              select: {
                id: true,
                status: true,
                isAuthentic: true,
              },
            },
          },
        });
      }
    );

    // return if no verfication
    if (!newVerification) {
      return { message: "Invalid Tree Verification" };
    }

    // check status of tree, if verified send
    // verified tree event (complete logic,
    // send verifiers / planter paid TG message)

    if (newVerification.tree.status === "VERIFIED") {
      // send verification complete event
      await step.sendEvent("send-tree-verification-complete-event", {
        name: "tree/verification.completed",
        data: { treeId: newVerification.tree.id },
      });
    }

    // send TG Channel for new verification and let it show if tree was verified
    // show authenticity of tree

    const verifEnded = isTreeVerficationEnded(newVerification.tree.status);
    const finalAuthenticity = !verifEnded
      ? "N/A"
      : newVerification.tree.isAuthentic
      ? "REAL"
      : "FAKE";

    const message = `<b>🌳 New Tree Verification Submitted!</b>

Verifier Username: <b>${newVerification.verifier.username}</b>
Tree Authenticity Submitted: <b>${
      newVerification.treeIsAuthentic ? "REAL" : "FAKE"
    }</b>
Final Tree Authenticity: <b>${finalAuthenticity}</b>
    
Additional Information: <b>${newVerification.additionalInfo || ""}</b>

Thank you for contributing to the verification process and helping us maintain accurate records with ${
      siteConfig.name
    }!

`;

    await step.sendEvent("send-new-tree-verification-notification", {
      name: "notifications/telegram.post",
      data: { message, type: "BROADCAST" },
    });

    // return

    return { message: `New tree verification: ${verificationId} added!!!` };
  }
);
