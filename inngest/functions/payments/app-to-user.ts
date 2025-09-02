import PiNetwork from "pi-backend";

import { env } from "@/env.mjs";
import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma";
import { PaymentData, PaymentDTO, PaymentDTOMemo } from "@/types/pi";

export const appToUserPayment = inngest.createFunction(
  { id: "app-to-user-payment", retries: 1 },
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

    // check if there is incomplete payment
    const incompletePayments = await step.run("get-incomplete-payments", () => {
      return pi.getIncompleteServerPayments() as unknown as {
        incomplete_server_payments: PaymentDTO<PaymentDTOMemo>[];
      };
    });

    // if there is get db payment
    if (incompletePayments.incomplete_server_payments.length > 0) {
      const incompletePayment =
        incompletePayments.incomplete_server_payments[0];

      await step.run("upsert-db-incomplete-payments", () => {
        return prisma.payment.upsert({
          where: { paymentId: incompletePayment.identifier },
          create: {
            paymentId: incompletePayment.identifier,
            amount: incompletePayment.amount,
            purposeId: incompletePayment.metadata.purpose,
            type: incompletePayment.metadata.type,
          },
          update: {},
          select: { status: true },
        });
      });
      // submit and complete transaction if no transaction
      if (incompletePayment.transaction === null) {
        // It is strongly recommended that you store the txId along with the paymentId you stored earlier for your reference.
        const txId = await step
          .run("submit-incomplete-payment", async () => {
            return pi.submitPayment(incompletePayment.identifier);
          })
          .catch((err) => {
            console.log({ err });
            step.run("cancel-incomplete-payment", async () => {
              await pi.cancelPayment(incompletePayment.identifier);
            });
          });

        if (txId) {
          await step.run("update-db-incomplete-payment", async () => {
            return prisma.payment.update({
              where: { paymentId: incompletePayment.identifier },
              data: { txId, status: "COMPLETED" },
              select: { paymentId: true },
            });
          });

          await step.run("complete-incomplete-payment", async () => {
            return pi.completePayment(incompletePayment.identifier, txId);
          });
        }

        // just complete transaction
      } else {
        await step.run("update-db-incomplete-payment", async () => {
          return prisma.payment.update({
            where: { paymentId: incompletePayment.identifier },
            data: {
              txId: incompletePayment.transaction?.txid,
              status: incompletePayment.transaction?.txid
                ? "COMPLETED"
                : "CANCELLED",
            },
            select: { paymentId: true },
          });
        });

        await step.run("complete-incomplete-payment", async () => {
          if (!incompletePayment.transaction?.txid) {
            return pi.cancelPayment(incompletePayment.identifier);
          }
          return pi.completePayment(
            incompletePayment.identifier,
            incompletePayment.transaction?.txid
          );
        });
      }
    }

    const paymentId = await step.run("create-payment", () => {
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

    const txLink = `${env.PI_EXPLORER_LINK}/tx/${transaction.txid}`;

    const message = `<b>🎉 Reward Sent! 🎉</b>

We are excited to announce that a reward of <b>${amount.toFixed(
      2
    )}</b> Pi has been successfully sent out!

Check the transaction details on Pi Explorer: <a href="${txLink}">View Transaction</a>

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
