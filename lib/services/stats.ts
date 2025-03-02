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

  return `🌳 Bounty Hunt Contest is Live! Join now, create contests, and win Pi tokens! 🎉 | ${
    contestAnnouncements.length > 0 ? "Active Bounty Hunts:" : ""
  } ${contestAnnouncements.join(" | ")}`;
};
