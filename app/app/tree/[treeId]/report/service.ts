import { MIN_POLICING_POINTS } from "@/config/site";
import { prisma } from "@/lib/prisma";

export async function getTreeForReport(treeId: string) {
  try {
    return prisma.tree.findUnique({
      where: { id: treeId, status: "MATURED", archivedAt: null },
      select: {
        id: true,
        isAuthentic: true,
        createdAt: true,
        latitude: true,
        longitude: true,
        planter: {
          select: {
            id: true,
            username: true,
          },
        },
        verifications: {
          select: {
            verifierId: true,
          },
        },
        report: { select: { id: true } },
      },
    });
  } catch (error) {
    console.error("Error fetching tree for report:", error);
    return null;
  }
}

export const getTreeReportAuthorization = (
  tree: TreeForReport,
  user: {
    id: string;
    policingPoints: number;
  } | null
) => {
  if (!tree) {
    return { canReport: false, reason: "Tree not found" };
  }

  // Check if the tree has already been reported
  if (tree.report) {
    return {
      canReport: false,
      reason: "This tree has already been reported",
    };
  }

  if (!user) {
    return { canReport: false, reason: "User not found" };
  }

  // Check if the user has enough policing points
  if (user.policingPoints < MIN_POLICING_POINTS) {
    return {
      canReport: false,
      reason: `You don't have enough policing points (minimum ${MIN_POLICING_POINTS} required)`,
    };
  }

  // For real trees (user wants to report as fake)
  if (tree.isAuthentic) {
    // Check if the user is the planter or a verifier
    const isPlanter = tree.planter.id === user.id;
    const isVerifier = tree.verifications.some((v) => v.verifierId === user.id);

    if (isPlanter || isVerifier) {
      return {
        canReport: false,
        reason: "You cannot report a tree you planted or verified",
      };
    }

    return { canReport: true, reason: null };
  }
  // For fake trees (planter wants to contest)
  else {
    // Only the planter can contest a fake tree
    const isPlanter = tree.planter.id === user.id;

    if (!isPlanter) {
      return {
        canReport: false,
        reason: "Only the tree planter can contest a tree marked as fake",
      };
    }

    return { canReport: true, reason: null };
  }
};

export type TreeForReport = Awaited<ReturnType<typeof getTreeForReport>>;
