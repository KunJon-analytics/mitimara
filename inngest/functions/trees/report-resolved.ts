import {
  MIN_POLICING_POINTS,
  POLICING_REWARDS,
  treeLogicConfig,
} from "@/config/site";
import { env } from "@/env.mjs";
import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma";

export const reportResolvedEvent = inngest.createFunction(
  { id: "report-resolved" },
  { event: "tree/report.resolved" },
  async ({ event, step }) => {
    const { reportId, notes } = event.data;

    // get resolved report
    const resolvedReport = await step.run("get-resolved-report", async () => {
      return prisma.treeReport.findUnique({
        where: {
          id: reportId,
          resolver: { not: null },
          status: { not: "PENDING" },
        },
        select: {
          id: true,
          status: true,
          reporterId: true,
          resolver: true,
          tree: {
            select: {
              isAuthentic: true,
              id: true,
              planterId: true,
              localBountyId: true,
              verifications: {
                select: { treeIsAuthentic: true, verifierId: true },
              },
            },
          },
        },
      });
    });

    // return if no resolved report
    if (!resolvedReport) {
      return { message: "Invalid Resolved Report" };
    }

    const tree = resolvedReport.tree;
    const isTreeReal = tree.isAuthentic;
    const isDeclined = resolvedReport.status === "DECLINED";
    const planterRewards =
      treeLogicConfig.minPlanterPoints * treeLogicConfig.planterRewardFactor;

    // DECLINED report of FAKE tree - archive tree
    if (isDeclined && !isTreeReal) {
      await step.run("archive-fake-tree-reported", async () => {
        return prisma.tree.update({
          where: { id: tree.id },
          data: {
            archivedAt: new Date(),
          },
          select: { id: true },
        });
      });
    }
    // AGREED report of FAKE tree (reported by planter) and update tree to real
    else if (!isDeclined && !isTreeReal) {
      // update tree to real
      await step.run("update-reported-tree-to-real", async () => {
        return prisma.tree.update({
          where: { id: tree.id },
          data: { isAuthentic: true, archivedAt: null },
          select: { id: true },
        });
      });

      // Add planter points for planter and policing point
      // and localbounty planter reward
      await step.run("increase-planter-ecosystem-policing-points", async () => {
        const bountyRewards =
          tree.localBountyId === null
            ? undefined
            : {
                upsert: {
                  create: {
                    localBountyId: tree.localBountyId,
                    treesPlanted: 1,
                  },
                  update: { treesPlanted: { increment: 1 } },
                  where: {
                    bountyRewardId: {
                      userId: tree.planterId,
                      localBountyId: tree.localBountyId,
                    },
                  },
                },
              };

        return prisma.user.update({
          where: { id: tree.planterId },
          select: { points: true, policingPoints: true },
          data: {
            points: {
              increment: planterRewards, // Adjust the point value as needed
            },
            policingPoints: { increment: MIN_POLICING_POINTS },
            bountyRewards,
          },
        });
      });

      // Process verifiers
      for (const verification of tree.verifications) {
        if (verification.treeIsAuthentic) {
          // Add verifier points for verifier with treeIsAuthentic = true
          // and upsert localbounty verifier point
          await step.run(
            `increase-authentic-verifier-points-${verification.verifierId}`,
            async () => {
              const bountyRewards =
                tree.localBountyId === null
                  ? undefined
                  : {
                      upsert: {
                        create: {
                          localBountyId: tree.localBountyId,
                          treesVerified: 1,
                        },
                        update: { treesVerified: { increment: 1 } },
                        where: {
                          bountyRewardId: {
                            userId: verification.verifierId,
                            localBountyId: tree.localBountyId,
                          },
                        },
                      },
                    };
              return await prisma.user.update({
                where: { id: verification.verifierId },
                select: { points: true, policingPoints: true },
                data: {
                  points: {
                    increment:
                      treeLogicConfig.minVerifierPoints *
                      treeLogicConfig.verifierRewardFactor, // Adjust the point value as needed
                  },
                  bountyRewards,
                },
              });
            }
          );
        } else {
          // Subtract (verifier points + penalty) for verifiers with treeIsAuthentic = false
          // and update decreased localbounty verifier point
          await step.run(
            `decrease-fake-verifier-points-${verification.verifierId}`,
            async () => {
              const bountyRewards = tree.localBountyId
                ? {
                    update: {
                      data: { treesVerified: { decrement: 1 } },
                      where: {
                        bountyRewardId: {
                          userId: verification.verifierId,
                          localBountyId: tree.localBountyId,
                        },
                      },
                    },
                  }
                : undefined;
              return await prisma.user.update({
                where: { id: verification.verifierId },
                select: { points: true, policingPoints: true },
                data: {
                  points: {
                    decrement:
                      treeLogicConfig.minVerifierPoints *
                      treeLogicConfig.verifierRewardFactor, // 5 points + 3 penalty (adjust as needed)
                  },
                  bountyRewards,
                },
              });
            }
          );
        }
      }
    }
    // AGREED report of REAL tree (reported by non participating user)
    else if (!isDeclined && isTreeReal) {
      // Update the tree status and archive tree
      await step.run("update-fake-tree-status-and-archive", async () => {
        return prisma.tree.update({
          where: { id: tree.id },
          select: { id: true },
          data: {
            isAuthentic: false,
            archivedAt: new Date(),
          },
        });
      });

      // Add policing point (1 * 2) for reporter
      await step.run("increase-reporter-policing-points", async () => {
        return prisma.user.update({
          where: { id: resolvedReport.reporterId },
          select: { points: true, policingPoints: true },
          data: {
            policingPoints: {
              increment: POLICING_REWARDS,
            },
          },
        });
      });

      // Subtract planter points
      await step.run("decrease-planter-ecosystem-points", async () => {
        const bountyRewards = tree.localBountyId
          ? {
              update: {
                data: { treesPlanted: { decrement: 1 } },
                where: {
                  bountyRewardId: {
                    userId: tree.planterId,
                    localBountyId: tree.localBountyId,
                  },
                },
              },
            }
          : undefined;
        return prisma.user.update({
          where: { id: tree.planterId },
          data: {
            points: {
              decrement: planterRewards, // Adjust the point value as needed
            },
            bountyRewards,
          },
        });
      });

      // Process verifiers
      for (const verification of tree.verifications) {
        if (!verification.treeIsAuthentic) {
          // Add verifier points for verifier with treeIsAuthentic = false
          await step.run(
            `increase-verifier-ecosystem-points-${verification.verifierId}`,
            async () => {
              const bountyRewards =
                tree.localBountyId === null
                  ? undefined
                  : {
                      upsert: {
                        create: {
                          localBountyId: tree.localBountyId,
                          treesVerified: 1,
                        },
                        update: { treesVerified: { increment: 1 } },
                        where: {
                          bountyRewardId: {
                            userId: verification.verifierId,
                            localBountyId: tree.localBountyId,
                          },
                        },
                      },
                    };
              return prisma.user.update({
                where: { id: verification.verifierId },
                select: { points: true, policingPoints: true },
                data: {
                  points: {
                    increment:
                      treeLogicConfig.minVerifierPoints *
                      treeLogicConfig.verifierRewardFactor, // Adjust the point value as needed
                  },
                  bountyRewards,
                },
              });
            }
          );
        } else {
          // Subtract (verifier points + penalty) for verifiers with treeIsAuthentic = true
          await step.run(
            `decrease-verifier-ecosystem-points-${verification.verifierId}`,
            async () => {
              const bountyRewards = tree.localBountyId
                ? {
                    update: {
                      data: { treesVerified: { decrement: 1 } },
                      where: {
                        bountyRewardId: {
                          userId: verification.verifierId,
                          localBountyId: tree.localBountyId,
                        },
                      },
                    },
                  }
                : undefined;
              return prisma.user.update({
                where: { id: verification.verifierId },
                select: { points: true, policingPoints: true },
                data: {
                  points: {
                    decrement:
                      treeLogicConfig.minVerifierPoints *
                      treeLogicConfig.verifierRewardFactor, // 5 points + 3 penalty (adjust as needed)
                  },
                  bountyRewards,
                },
              });
            }
          );
        }
      }
    }

    // create new admin log
    await step.run("create-admin-log-for-report-resolution", async () => {
      await prisma.adminLogAction.create({
        data: {
          action: `REPORT_RESOLUTION_${resolvedReport.id}`,
          reason: notes,
          admin: resolvedReport.resolver!, // You would get this from your auth system
        },
        select: { id: true },
      });
    });

    // send TG Admin message for resolved report
    const reportUrl = `${env.NEXT_PUBLIC_PINET_URL}/app/reports/${reportId}`;
    const treeUrl = `${env.NEXT_PUBLIC_PINET_URL}/app/tree/${tree.id}`;

    // Create notes snippet (first 100 characters)
    const notesSnippet =
      notes.length > 100 ? notes.substring(0, 100) + "..." : notes;

    // Determine emoji and impact text based on resolution and tree status
    let emoji, impactText;

    if (resolvedReport.status === "AGREED") {
      if (tree.isAuthentic) {
        emoji = "❌";
        impactText = `Tree marked as FAKE. Reporter +${POLICING_REWARDS} policing points. Planter -${planterRewards.toFixed(
          2
        )} points. Verifiers adjusted.`;
      } else {
        emoji = "✅";
        impactText = `Tree restored as REAL. Planter +${planterRewards.toFixed(
          2
        )} points. Verifiers adjusted.`;
      }
    } else {
      // DECLINED
      if (tree.isAuthentic) {
        emoji = "✅";
        impactText = "Tree remains REAL. No point changes.";
      } else {
        emoji = "🗑️";
        impactText = "Fake tree archived. No point changes.";
      }
    }

    // Create the HTML message
    const message = `
<b>${emoji} REPORT RESOLUTION</b>

<b>Report:</b> <a href="${reportUrl}">Report #${reportId.slice(-6)}</a>
<b>Tree:</b> <a href="${treeUrl}">Tree #${tree.id.slice(-6)}</a>

<b>Resolution:</b> ${resolvedReport.status}
<b>Resolved by:</b> ${resolvedReport.resolver}

<b>Impact:</b> ${impactText}

<b>Notes:</b>
<i>${notesSnippet}</i>
`;

    await step.sendEvent("send-tree-reported-notification", {
      name: "notifications/telegram.post",
      data: { message, type: "BUG_REPORT" },
    });

    // return

    return { message: `Tree Report: ${reportId} resolved!!!` };
  }
);
