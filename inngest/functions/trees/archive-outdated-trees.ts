import { subMonths } from "date-fns";

import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma";
import { verificationNotStartedStatus } from "@/lib/tree/constants";
import { MONTHS_BEFORE_TREES_ARCHIVE } from "@/config/site";

// Some function we'll call
export const archiveOutdatedTrees = inngest.createFunction(
  { id: "trees/outdated.archive" },
  { cron: "5 1 * * *" },
  async ({ step }) => {
    const lt = subMonths(new Date(), MONTHS_BEFORE_TREES_ARCHIVE);

    const oudatedTrees = await step.run("archive-outdated-trees", async () => {
      return prisma.tree.updateMany({
        where: {
          archivedAt: null,
          updatedAt: { lt },
          OR: [
            { status: { in: verificationNotStartedStatus } },
            {
              status: "MATURED",
              isAuthentic: false,
            },
          ],
        },
        data: { archivedAt: new Date() },
      });
    });

    return oudatedTrees;
  }
);
