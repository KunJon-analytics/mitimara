import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma";

export const testnetReward = inngest.createFunction(
  { id: "testnet-reward" },
  { event: "payments/reward-testnet" },
  async ({ event, step }) => {
    const { uid, purpose } = event.data;

    const decrement = 0.1;

    await step.run("reduce-reward-pot-balance", async () => {
      return prisma.pot.update({
        where: { name: "Planter / Verifier Rewards Pot" },
        data: { balance: { decrement } },
        select: { balance: true, id: true },
      });
    });

    // send 0.1 to user
    await step.sendEvent("send-test-reward-event", {
      name: "payments/app-to-user",
      data: {
        amount: decrement,
        memo: "Test reward payment on Mitimara",
        purpose,
        type: "CLAIM_REWARD",
        uid,
      },
    });

    return {
      message: `User: ${uid} successfully paid ${decrement.toFixed(2)}`,
    };
  }
);
