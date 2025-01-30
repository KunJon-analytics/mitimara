import { siteConfig, treeLogicConfig } from "@/config/site";
import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma";

export const treeVerificationCompleted = inngest.createFunction(
  { id: "tree-verification-completed" },
  { event: "tree/verification.completed" },
  async ({ event, step }) => {
    const { treeId } = event.data;

    // get tree completely verified
    const verifiedTree = await step.run("get-verified-tree", async () => {
      return prisma.tree.findUnique({
        where: {
          id: treeId,
          status: "VERIFIED",
        },
        select: { status: true, id: true },
      });
    });

    // return if no verfication
    if (!verifiedTree) {
      return { message: "Invalid Tree" };
    }

    // change tree status to PLANTERS_PAID
    const planterPaidTree = await step.run(
      "change-tree-status-to-planter-paid",
      async () => {
        return prisma.tree.update({
          where: {
            id: verifiedTree.id,
            status: "VERIFIED",
          },
          select: {
            id: true,
            isAuthentic: true,
            planterId: true,
            localBountyId: true,
          },
          data: {
            status: "PLANTERS_PAID",
          },
        });
      }
    );

    // pay planter
    // add planter points x2 if tree is authentic and
    // add reward if tree is bounty tree
    if (planterPaidTree.isAuthentic) {
      await step.run("add-planter-points-and-bounty-reward", async () => {
        const bountyRewards =
          planterPaidTree.localBountyId === null
            ? undefined
            : {
                upsert: {
                  create: {
                    localBountyId: planterPaidTree.localBountyId,
                    treesPlanted: 1,
                  },
                  update: { treesPlanted: { increment: 1 } },
                  where: {
                    bountyRewardId: {
                      userId: planterPaidTree.planterId,
                      localBountyId: planterPaidTree.localBountyId,
                    },
                  },
                },
              };

        return prisma.user.update({
          where: {
            id: planterPaidTree.planterId,
          },
          select: { id: true },
          data: {
            points: {
              increment:
                treeLogicConfig.minPlanterPoints *
                treeLogicConfig.planterRewardFactor,
            },
            bountyRewards,
          },
        });
      });
    }

    // CHANGE TREE STATUS TO PAID_VERIFIER
    const verifiersPaidtree = await step.run(
      "change-tree-status-to-verifier-paid",
      async () => {
        return prisma.tree.update({
          where: {
            id: planterPaidTree.id,
            status: "PLANTERS_PAID",
          },
          select: { isAuthentic: true, id: true, localBountyId: true },
          data: {
            status: "VERIFIERS_PAID",
          },
        });
      }
    );

    // then pay verifier
    // and verifier with same authenticity x2 points

    const increasedVerifiers = await step.run(
      "add-verifiers-points",
      async () => {
        return prisma.user.updateManyAndReturn({
          where: {
            treeVerifications: {
              some: {
                treeId: verifiersPaidtree.id,
                treeIsAuthentic: verifiersPaidtree.isAuthentic,
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
          select: { id: true },
        });
      }
    );

    //if verierspaidtree has local bounty upsert rewards
    if (verifiersPaidtree.localBountyId !== null) {
      for (let index = 0; index < increasedVerifiers.length; index++) {
        const verifier = increasedVerifiers[index];
        await step.run(`increase-verifier-reward-${verifier.id}`, async () => {
          return await prisma.participantReward.upsert({
            create: {
              treesVerified: 1,
              userId: verifier.id,
              localBountyId: verifiersPaidtree.localBountyId!,
            },
            update: { treesVerified: { increment: 1 } },
            where: {
              bountyRewardId: {
                userId: verifier.id,
                localBountyId: verifiersPaidtree.localBountyId!,
              },
            },
            select: { id: true },
          });
        });
      }
    }

    // CHANGE TREE STATUS TO MATURED
    const maturedTree = await step.run(
      "change-tree-status-to-matured",
      async () => {
        return prisma.tree.update({
          where: {
            id: verifiersPaidtree.id,
            status: "VERIFIERS_PAID",
          },
          select: { id: true, isAuthentic: true },
          data: {
            status: "MATURED",
          },
        });
      }
    );

    // send TG Channel for tree matured...probably add tree link

    const finalAuthenticity = maturedTree.isAuthentic ? "REAL" : "FAKE";

    const treeUrl = `${siteConfig.url}/app/tree/${maturedTree.id}`;

    const message = `<b>Tree Verification Complete</b> 🌳

A tree has been <a href='${treeUrl}'>completely verified</a> on ${siteConfig.name}.
<b>Status:</b> <i>${finalAuthenticity}</i>

If eligible, planter and verifiers are <b>paid</b>.

`;

    await step.sendEvent("send-tree-matured-notification", {
      name: "notifications/telegram.post",
      data: { message, type: "BROADCAST" },
    });

    // return

    return { message: `Tree: ${maturedTree.id} completely mature!!!` };
  }
);
