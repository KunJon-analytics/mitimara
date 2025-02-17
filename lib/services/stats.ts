import { env } from "@/env.mjs";
import prisma from "../prisma";
import { getActiveBountyContests } from "./bounty-hunt";

export const getSiteStats = async () => {
  try {
    const [users, trees, treeVerifications] = await prisma.$transaction([
      prisma.user.count(),
      prisma.tree.count(),
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

  return `${
    env.NEXT_PUBLIC_TESTNET_REWARD
      ? "🌳 Support MitiMara! 🌳 Help us get listed in the Pi Network ecosystem apps! We need testnet Pi payments from 10+ unique wallets. Please donate or subscribe using your wallet to support our mission for a greener future. 🌍💚 | "
      : ""
  }🌳 Bounty Hunt Contest is Live! Join now, create contests, and win Pi tokens! 🎉 | ${
    contestAnnouncements.length > 0 ? "Active Bounty Hunts:" : ""
  } ${contestAnnouncements.join(" | ")}`;
};
