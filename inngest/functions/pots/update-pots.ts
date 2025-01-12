import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma";

export const updatePots = inngest.createFunction(
  { id: "update-pots" },
  { event: "pots/balance-updated" },
  async ({ event, step }) => {
    const { amount } = event.data;

    // get all open pots
    const openPots = await step.run("get-all-open-pots", async () => {
      return prisma.pot.findMany({
        where: {
          isOpen: true,
        },
        select: {
          id: true,
          revenueFraction: true,
        },
      });
    });

    // return if no open pots
    if (openPots.length < 1) {
      return { message: "No open pots" };
    }

    // get all open pots
    const updatedPots = await step.run("update-all-open-pots", async () => {
      // create update pots params for prisma transactions api
      const updateParams = openPots.map(({ id, revenueFraction }) => {
        return prisma.pot.update({
          where: { id },
          data: { balance: { increment: amount * revenueFraction } },
          select: { name: true, balance: true },
        });
      });
      return prisma.$transaction(updateParams);
    });

    // return

    return {
      message: `All ${updatedPots.length} open pots have received share of: ${amount} payment`,
    };
  }
);
