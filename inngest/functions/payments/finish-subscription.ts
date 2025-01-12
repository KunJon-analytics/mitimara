import { subscriptionConfig } from "@/config/site";
import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma";

export const finishSubscription = inngest.createFunction(
  { id: "finish-subscription" },
  { event: "payments/subscription-finished" },
  async ({ event, step }) => {
    const { amount, userId } = event.data;

    // update user points
    const updatedUser = await step.run("update-subscriber", async () => {
      return prisma.user.update({
        where: {
          id: userId,
        },
        select: {
          username: true,
        },
        data: { points: { increment: subscriptionConfig.userPointsPerPi } },
      });
    });

    // update pots with subscription fee
    await step.sendEvent("update-pots-balance", {
      name: "pots/balance-updated",
      data: { amount },
    });

    // return

    return { message: `${updatedUser.username} Subscription completed!!!` };
  }
);
