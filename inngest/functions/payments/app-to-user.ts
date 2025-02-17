import PiNetwork from "pi-backend";

import { env } from "@/env.mjs";
import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma";
import { PaymentData, PaymentDTOMemo } from "@/types/pi";

export const appToUserPayment = inngest.createFunction(
  { id: "app-to-user-payment" },
  { event: "payments/app-to-user" },
  async ({ event, step }) => {
    const { amount, memo, purpose, type, uid } = event.data;

    // get bounty with payment ID

    // CREATE Pi instance
    const apiKey = env.PI_API_KEY;
    const walletPrivateSeed = env.PI_SECRET_KEY; // starts with S
    const pi = new PiNetwork(apiKey, walletPrivateSeed);

    const paymentData: PaymentData<PaymentDTOMemo> & { uid: string } = {
      amount,
      memo,
      metadata: { purpose, type },
      uid,
    };
    // It is critical that you store paymentId in your database
    // so that you don't double-pay the same user, by keeping track of the payment.

    const paymentId = await step.run("create-payment", async () => {
      return pi.createPayment(paymentData);
    });

    await step.run("create-db-payment", async () => {
      return prisma.payment.create({
        data: {
          amount,
          paymentId,
          type,
          purposeId: purpose,
          status: "INITIALIZED",
        },
        select: { paymentId: true },
      });
    });

    // It is strongly recommended that you store the txId along with the paymentId you stored earlier for your reference.
    const txId = await step.run("submit-payment", async () => {
      return pi.submitPayment(paymentId);
    });

    await step.run("update-db-payment", async () => {
      return prisma.payment.update({
        where: { paymentId },
        data: { txId, status: "COMPLETED" },
        select: { paymentId: true },
      });
    });

    const { transaction } = await step.run("complete-payment", async () => {
      return pi.completePayment(paymentId, txId);
    });

    if (!transaction) {
      return { message: "Transaction was not completed!!!" };
    }

    const message = `<b>🎉 Reward Sent! 🎉</b>

We are excited to announce that a reward of <b>${amount.toFixed(
      2
    )}</b> Pi has been successfully sent out!

Check the transaction details on Pi Explorer: <a href="${
      transaction._link
    }">View Transaction</a>

Thank you for being a valued member of the MitiMara community!
    `;

    await step.sendEvent("send-user-paid-event-notification", {
      name: "notifications/telegram.post",
      data: { message, type: "BROADCAST" },
    });

    // return

    return { message: `User: ${uid} successfully paid ${amount.toFixed(2)}` };
  }
);
