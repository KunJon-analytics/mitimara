import { prisma } from "@/lib/prisma";

export async function getBountyHuntById(id: string) {
  return await prisma.localBounty.findUnique({
    where: { id },
    select: {
      centerLatitude: true,
      id: true,
      centerLongitude: true,
      paymentId: true,
      description: true,
      location: true,
      radius: true,
      startDate: true,
      endDate: true,
      title: true,
      totalBounty: true,
      creator: {
        select: { username: true, id: true },
      },
      trees: { select: { isAuthentic: true } },
      _count: { select: { participantRewards: true } },
    },
  });
}

export const getActiveContest = async (bountyId: string) => {
  const now = new Date();
  return prisma.localBounty.findUnique({
    where: {
      id: bountyId,
      startDate: { lte: now },
      endDate: { gte: now },
      paymentId: { not: null },
    },
    select: {
      centerLatitude: true,
      centerLongitude: true,
      totalBounty: true,
      radius: true,
      title: true,
      id: true,
      startDate: true,
      endDate: true,
      description: true,
      location: true,
    },
  });
};

export async function getActiveBountyContests() {
  const now = new Date();
  const contests = await prisma.localBounty.findMany({
    where: {
      startDate: { lte: now },
      endDate: { gte: now },
      paymentId: { not: null },
    },
    orderBy: {
      endDate: "asc",
    },
    // take: 5, // Limit to 5 contests for the announcement
    select: {
      id: true,
      title: true,
      centerLatitude: true,
      centerLongitude: true,
      radius: true,
      startDate: true,
      endDate: true,
      totalBounty: true,
    },
  });

  return contests;
}
