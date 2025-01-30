import { isFuture } from "date-fns";

import { treeLogicConfig } from "@/config/site";
import { calculateDistance } from "../utils";

export type WithinEventParams = {
  userLng: number;
  userLat: number;
  eventLng: number;
  eventLat: number;
  eventRadius: number;
};

export type UserRewardParam = {
  userTreesPlanted: number;
  userTreesVerified: number;
  huntRate: number;
};

export type BountyRewardParam = {
  totalTreesPlanted: number;
  totalTreesVerified: number;
  totalBounty: number;
  bountyClaimed: number;
  endDate: Date;
};

export const isWithinEvent = (params: WithinEventParams) => {
  const distanceFromEventCenter = calculateDistance(
    params.eventLat,
    params.eventLng,
    params.userLat,
    params.userLng
  );

  const distanceFromEvent =
    distanceFromEventCenter > params.eventRadius
      ? distanceFromEventCenter - params.eventRadius
      : 0;

  const withinEvent = distanceFromEvent === 0;

  const data = { distanceFromEventCenter, distanceFromEvent, withinEvent };
  return data;
};

export const getHuntRewardRate = (param: BountyRewardParam): number => {
  if (isFuture(param.endDate)) {
    return 0;
  }

  const unclaimmedPi = param.totalBounty - param.bountyClaimed;
  if (unclaimmedPi <= 0) {
    return 0;
  }

  const plantersShare =
    param.totalTreesPlanted === 0
      ? 0
      : param.totalTreesPlanted * treeLogicConfig.planterRewardFactor;
  const verifiersShare =
    param.totalTreesVerified === 0
      ? 0
      : param.totalTreesVerified * treeLogicConfig.verifierRewardFactor;
  const totalShare = plantersShare + verifiersShare;
  return totalShare === 0 ? 0 : unclaimmedPi / totalShare;
};

export const getUserClaimmableReward = (param: UserRewardParam): number => {
  const plantingShare =
    param.userTreesPlanted === 0
      ? 0
      : param.userTreesPlanted * treeLogicConfig.planterRewardFactor;
  const verifyingShare =
    param.userTreesVerified === 0
      ? 0
      : param.userTreesVerified * treeLogicConfig.verifierRewardFactor;
  const totalShare = plantingShare + verifyingShare;
  return totalShare === 0 ? 0 : param.huntRate * totalShare;
};

export const getBountyTotals = (
  params: {
    treesPlanted: number;
    treesVerified: number;
  }[]
): { totalTreesPlanted: number; totalTreesVerified: number } => {
  const result = params.reduce(
    (total, current) => {
      return {
        ...total,
        totalTreesPlanted: total.totalTreesPlanted + current.treesPlanted,
        totalTreesVerified: total.totalTreesVerified + current.treesVerified,
      };
    },
    { totalTreesPlanted: 0, totalTreesVerified: 0 }
  );
  return result;
};

type GetUserRewardsParams = {
  bountyRewards: {
    treesPlanted: number;
    treesVerified: number;
  }[];
  totalBounty: number;
  bountyClaimed: number;
  endDate: Date;
  userTreesPlanted: number;
  userTreesVerified: number;
};

export const getUserRewards = ({
  bountyClaimed,
  bountyRewards,
  endDate,
  totalBounty,
  userTreesPlanted,
  userTreesVerified,
}: GetUserRewardsParams): number => {
  const { totalTreesPlanted, totalTreesVerified } =
    getBountyTotals(bountyRewards);

  const huntRate = getHuntRewardRate({
    bountyClaimed,
    endDate,
    totalBounty,
    totalTreesPlanted,
    totalTreesVerified,
  });

  if (huntRate === 0) {
    return 0;
  }

  const result = getUserClaimmableReward({
    huntRate,
    userTreesPlanted,
    userTreesVerified,
  });
  return result;
};
