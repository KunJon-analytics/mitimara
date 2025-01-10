import { siteConfig, treeLogicConfig } from "@/config/site";
import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma";
import { treeVerified } from "@/lib/tree/utils";

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
          },
          select: {
            verifier: { select: { username: true } },
            createdAt: true,
            additionalInfo: true,
            treeIsAuthentic: true,
            tree: {
              select: {
                verifications: { select: { treeIsAuthentic: true } },
                id: true,
                planter: { select: { username: true, id: true } },
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

    const treeVerifiable = treeVerified(newVerification.tree);

    if (treeVerifiable) {
      // if tree is verifiable, mark tree as verified using today date
      // mark tree authenticity
      const verifiedTree = await step.run(
        "update-tree-verified-and-authenticity",
        async () => {
          return prisma.tree.update({
            where: {
              id: newVerification.tree.id,
              dateVerified: null,
            },
            select: { isAuthentic: true, id: true },
            data: {
              dateVerified: new Date(),
              isAuthentic: newVerification.treeIsAuthentic,
            },
          });
        }
      );

      // add planter points x2 if tree is authentic
      if (verifiedTree.isAuthentic) {
        await step.run("add-planter-ponts", async () => {
          return prisma.user.update({
            where: {
              id: newVerification.tree.planter.id,
            },
            select: { id: true },
            data: {
              points: {
                increment:
                  treeLogicConfig.minPlanterPoints *
                  treeLogicConfig.planterRewardFactor,
              },
            },
          });
        });
      }

      // and verifier with same authenticity x2 points

      await step.run("add-verifiers-points", async () => {
        return prisma.user.updateMany({
          where: {
            treeVerifications: {
              some: {
                treeId: verifiedTree.id,
                treeIsAuthentic: verifiedTree.isAuthentic,
              },
            },
          },

          data: {
            points: {
              increment:
                treeLogicConfig.minVerifierPoints *
                treeLogicConfig.verifierRewardFactor,
            },
          },
        });
      });
    }

    // send TG Channel for new verification and let it show if tree was verified
    // show authenticity of tree

    const message = `<b>🌳 New Tree Verification Submitted!</b>

Verifier Username: <b>${newVerification.verifier.username}</b>
Tree Authenticity Agreed: <b>${newVerification.treeIsAuthentic}</b>
Final Tree Authenticity: <b>${
      treeVerifiable ? newVerification.treeIsAuthentic : "N/A"
    }</b>
    
Additional Information: <b>${newVerification.additionalInfo || ""}</b>

Thank you for contributing to the verification process and helping us maintain accurate records with ${
      siteConfig.name
    }!

`;

    await step.sendEvent("send-new-tree-verification-notification", {
      name: "notifications/telegram.send",
      data: { message, type: "BROADCAST" },
    });

    // return

    return { message: `New tree verification: ${verificationId} added!!!` };
  }
);
