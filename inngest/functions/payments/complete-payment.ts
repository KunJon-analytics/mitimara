import { env } from "@/env.mjs";
import { inngest } from "@/inngest/client";
import { getTGPaymentType } from "@/lib/pots/utils";
import prisma from "@/lib/prisma";

export const completePayment = inngest.createFunction(
  { id: "complete-payment" },
  { event: "payments/payment-completed" },
  async ({ event, step }) => {
    const { paymentId } = event.data;

    // get completed payment
    const completedPayment = await step.run(
      "get-completed-payment",
      async () => {
        return prisma.payment.findUnique({
          where: {
            paymentId,
            isRefunded: false,
            txId: { not: null },
            status: "COMPLETED",
          },
          select: {
            paymentId: true,
            amount: true,
            purposeId: true,
            txId: true,
            type: true,
          },
        });
      }
    );

    // return if no payment
    if (!completedPayment) {
      return { message: "Invalid Payment" };
    }

    // send events based on transaction type
    if (completedPayment.type === "DONATE") {
      // just update pots (later create its event if you want to e.g give nft to donor)
      await step.sendEvent("update-pots-balance", {
        name: "pots/balance-updated",
        data: { amount: completedPayment.amount },
      });
    }

    // for subscription payment update user points and update pots
    // just send userId (payment purposeId) and amount

    // send completed payment message to Team TG
    const txLink = `${env.PI_EXPLORER_LINK}/tx/${completedPayment.txId}`;
    const type = getTGPaymentType(completedPayment.type);
    const message = `<b>Payment Confirmed!</b> 🎉

<b>Type:</b> ${type}
<b>Amount:</b> ${completedPayment.amount.toFixed(2)} Pi
<b>Transaction Link:</b> <a href="${txLink}">View on Pi Explorer</a>

Thank you for your ${type}!
`;

    await step.sendEvent("send-updated-tree-info-notification", {
      name: "notifications/telegram.send",
      data: { message, type: "BROADCAST" },
    });

    // return

    return { message: `Payment: ${paymentId} completed!!!` };
  }
);
