import { prisma } from "@/lib/prisma";

export async function getReportDetails(reportId: string) {
  try {
    const report = await prisma.treeReport.findUnique({
      where: { id: reportId },
      select: {
        status: true,
        resolver: true,
        report: true,
        id: true,
        createdAt: true,
        updatedAt: true,
        tree: {
          select: {
            isAuthentic: true,
            id: true,
            createdAt: true,
            planter: {
              select: {
                id: true,
                username: true,
              },
            },
            verifications: {
              select: {
                verifier: {
                  select: {
                    id: true,
                    username: true,
                  },
                },
              },
            },
          },
        },
        reporter: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    return report;
  } catch (error) {
    console.error("Error fetching report details:", error);
    return null;
  }
}
