import { Prisma } from "@prisma/client";

export const treeRewardPot: Prisma.PotCreateInput = {
  isPublic: true,
  name: "Planter / Verifier Rewards Pot",
  revenueFraction: 70 / 100,
  isOpen: true,
};

export const referralRewardPot: Prisma.PotCreateInput = {
  isPublic: true,
  name: "Referral Rewards Pot",
  revenueFraction: 5 / 100,
  isOpen: true,
};

export const policingRewardPot: Prisma.PotCreateInput = {
  isPublic: true,
  name: "Community Policing Rewards Pot",
  revenueFraction: 5 / 100,
  isOpen: true,
};

export const teamRewardPot: Prisma.PotCreateInput = {
  isPublic: true,
  name: "Platform Development Pot",
  revenueFraction: 20 / 100,
  isOpen: true,
};

export const pots = [
  teamRewardPot,
  treeRewardPot,
  referralRewardPot,
  policingRewardPot,
];
