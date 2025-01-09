import prisma from "../prisma";
import { getSecurityPolicy } from "./filestack-policy";

export const getUserprofile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      _count: { select: { plantedTrees: true, treeVerifications: true } },
      noOfReferrals: true,
      points: true,
    },
  });

  if (!user) {
    return null;
  }
  // add explicit permission to add images for one day
  const now = Math.floor(new Date().getTime() / 1000);
  const onedaySeconds = 60 * 60 * 24;
  const expiry = now + onedaySeconds;

  const security = getSecurityPolicy(["pick", "read"], expiry);

  return { ...user, security };
};
