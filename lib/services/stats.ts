import { env } from "@/env.mjs";
import prisma from "../prisma";
import { getActiveBountyContests } from "./bounty-hunt";
import { treeRewardPot } from "../pots/constants";

// cache this value
export const getPointCoefficient = async () => {
  const [pot, totalUserPoints] = await prisma.$transaction([
    prisma.pot.findUnique({
      where: { name: treeRewardPot.name },
      select: { balance: true },
    }),
    prisma.user.aggregate({
      _sum: {
        points: true,
      },
    }),
  ]);

  const potBalance = pot?.balance ?? 0;

  if (potBalance < 1 || !totalUserPoints._sum.points) {
    return 0;
  }

  return potBalance / totalUserPoints._sum.points;
};

export const getSiteStats = async () => {
  try {
    const [users, trees, treeVerifications] = await prisma.$transaction([
      prisma.user.count(),
      prisma.tree.count({ where: { archivedAt: null } }),
      prisma.treeVerification.count(),
    ]);
    return { users, trees, treeVerifications };
  } catch (error) {
    console.error("GET_SITE_STATS", error);
    return { users: 0, trees: 0, treeVerifications: 0 };
  }
};

export const getAnnouncement = async (): Promise<string> => {
  const contests = await getActiveBountyContests();
  const contestAnnouncements = contests.map(
    (contest) =>
      `${contest.title} (${contest.centerLatitude.toFixed(
        6
      )} - ${contest.centerLongitude.toFixed(
        6
      )}), Bounty: π${contest.totalBounty.toFixed(2)}!`
  );

  return `🌳 Bounty Hunt Contest is Live! Join now, create contests, and win Pi tokens! 🎉 | ${
    contestAnnouncements.length > 0 ? "Active Bounty Hunts:" : ""
  } ${contestAnnouncements.join(" | ")}`;
};

const mainnetAnnouncements = [
  "🌱 MitiMara is now LIVE on mainnet! Plant trees, earn Pi, change the world. Learn more →",
  "🌍 Want to earn Pi while helping the planet? MitiMara is now on mainnet! Discover how →",
  "🚀 Just launched: Turn tree planting into real rewards with MitiMara on mainnet! See how it works →",
  "🌳 Join pioneers already planting trees and earning Pi on MitiMara — now live on mainnet! Learn more →",
  "🔥 Breaking: MitiMara launches on mainnet! Be among the first to plant, verify, and earn. Explore now →",
];

const introAnnouncements = [
  "🌱 MitiMara is now LIVE! Plant trees, earn Pi, change the world. Learn more →",
  "🌍 Want to earn Pi while helping the planet? Discover MitiMara today! Learn how →",
  "🚀 Just launched: Turn tree planting into real rewards with MitiMara! See how it works →",
  "🌳 Join the movement! Plant trees, earn rewards, build community with MitiMara. Learn more →",
  "🔥 Introducing MitiMara: The tree-planting platform that rewards your environmental impact. Explore now →",
];

export const getIntroAnnouncement = () => {
  const selectedAnnouncement = env.NEXT_PUBLIC_PINET_URL.includes("testnet")
    ? introAnnouncements
    : mainnetAnnouncements;
  const randomElement =
    selectedAnnouncement[
      Math.floor(Math.random() * selectedAnnouncement.length)
    ];
  return randomElement;
};
