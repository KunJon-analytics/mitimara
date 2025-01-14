import prisma from "../prisma";

export const getSiteStats = async () => {
  try {
    const [users, trees, treeVerifications] = await prisma.$transaction([
      prisma.user.count(),
      prisma.tree.count(),
      prisma.treeVerification.count(),
    ]);
    return { users, trees, treeVerifications };
  } catch (error) {
    console.log("GET_SITE_STATS", error);
    return { users: 0, trees: 0, treeVerifications: 0 };
  }
};
