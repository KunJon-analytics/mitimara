import { MIN_POLICING_POINTS, treeLogicConfig } from "@/config/site";
import prisma from "@/lib/prisma";

type ResolveUserPointsParams = {
  userId: string;
  action: "increment" | "decrement";
  localBountyId: string | null;
  userIsPlanter: boolean;
};

export const resolveUserPoints = async (params: ResolveUserPointsParams) => {
  const { action, localBountyId, userId, userIsPlanter } = params;

  const bountyPointsKey = userIsPlanter ? "treesPlanted" : "treesVerified";

  const ecosystemRewards = userIsPlanter
    ? treeLogicConfig.minPlanterPoints * treeLogicConfig.planterRewardFactor
    : treeLogicConfig.minVerifierPoints * treeLogicConfig.verifierRewardFactor;

  const policingPoints =
    userIsPlanter && action === "increment"
      ? { increment: MIN_POLICING_POINTS }
      : undefined;

  const bountyRewards = !localBountyId
    ? undefined
    : action === "increment"
    ? {
        upsert: {
          create: {
            localBountyId: localBountyId,
            [bountyPointsKey]: 1,
          },
          update: { [bountyPointsKey]: { increment: 1 } },
          where: {
            bountyRewardId: {
              userId: userId,
              localBountyId: localBountyId,
            },
          },
        },
      }
    : {
        update: {
          data: { [bountyPointsKey]: { decrement: 1 } },
          where: {
            bountyRewardId: {
              userId: userId,
              localBountyId: localBountyId,
            },
          },
        },
      };

  return prisma.user.update({
    where: { id: userId },
    select: { points: true, policingPoints: true },
    data: {
      points: {
        [action]: ecosystemRewards, // Adjust the point value as needed
      },
      bountyRewards,
      policingPoints,
    },
  });
};
