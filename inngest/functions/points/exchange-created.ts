import { STARTER_POINTS } from "@/config/site";
import { env } from "@/env.mjs";
import { inngest } from "@/inngest/client";
import { treeRewardPot } from "@/lib/pots/constants";
import prisma from "@/lib/prisma";

export const exchangeCreated = inngest.createFunction(
  { id: "exchange-created" },
  { event: "points/exchange.added" },
  async ({ event, step }) => {
    const { id } = event.data;

    const exchange = await step.run(
      "get-initiated-selected-exchange",
      async () => {
        return prisma.pointsForPiExchange.findUnique({
          where: { id, status: "INITIATED" },

          select: {
            id: true,
            amount: true,
            pointsTraded: true,
            user: { select: { uid: true, username: true } },
          },
        });
      }
    );

    if (!exchange) {
      return {
        message: "Invalid exchange",
      };
    }

    // update pot and user points if exchange verified
    await step.run("update-pot-and-user-points", async () => {
      return prisma.$transaction([
        prisma.pot.update({
          where: { name: treeRewardPot.name },
          data: { balance: { decrement: exchange.amount } },
        }),
        prisma.user.update({
          where: { uid: exchange.user.uid },
          data: { points: STARTER_POINTS },
        }),
      ]);
    });

    await step.run("update-selected-exchange-to-paid", async () => {
      return prisma.pointsForPiExchange.update({
        where: { id },
        data: { status: "PAYMENT_CREATED" },

        select: { id: true },
      });
    });

    // send pi payment
    await step.sendEvent("send-pi-tokens", {
      name: "payments/app-to-user",
      data: {
        amount: exchange.amount,
        memo: "Mitimara points exchange for Pi",
        purpose: id,
        type: "POINTS_EXCHANGE",
        uid: exchange.user.uid,
      },
    });

    // send tg message for new exchange
    // send telegram message for exchange.

    const exchangeLink = `${env.NEXT_PUBLIC_PINET_URL}/app/exchange/ecosystem/${exchange.id}`;

    const message = `<b>🚨 Exchange Notification 🚨</b>

A user has just initiated a point exchange for Pi tokens.

<b>Username:</b> ${exchange.user.username} <b>Points Traded:</b> ${
      exchange.pointsTraded
    } <b>Pi Amount:</b> ${exchange.amount.toFixed(2)} Pi

<a href="${exchangeLink}">View Exchange Details</a>

Please review and verify the transaction details. Thank you for your prompt attention!`;

    await step.sendEvent("send-new-bounty-event-notification", {
      name: "notifications/telegram.post",
      data: { message, type: "DEV_MODE" },
    });

    return {
      message: `User: ${
        exchange.user.uid
      } successfully paid ${exchange.amount.toFixed(2)}`,
    };
  }
);
