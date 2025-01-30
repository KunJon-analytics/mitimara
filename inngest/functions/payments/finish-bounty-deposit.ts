import axios from "axios";

import { env } from "@/env.mjs";
import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma";
import { localBountyLogicConfig } from "@/config/site";

export const finishBountyDeposit = inngest.createFunction(
  { id: "finish-hunt-deposit" },
  { event: "payments/bounty-deposited" },
  async ({ event, step }) => {
    const { localHuntId, paymentId } = event.data;

    // get bounty with payment ID

    const localHunt = await step.run("get-local-hunt", async () => {
      return prisma.localBounty.findUnique({
        where: {
          id: localHuntId,
          paymentId,
        },
        select: {
          title: true,
          id: true,
          totalBounty: true,
          centerLatitude: true,
          centerLongitude: true,
          radius: true,
        },
      });
    });

    if (!localHunt) {
      return { message: "Invalid Local Hunt" };
    }

    // reverse geocode and update it's location here and minus tax
    // fetch location
    const location = await step.run(
      "get-location-by-reverse-geo-coding",
      async () => {
        const url = `https://eu1.locationiq.com/v1/reverse?key=${env.LOCATIONIQ_ACCESS_TOKEN}&lat=${localHunt.centerLatitude}&lon=${localHunt.centerLongitude}&format=json&`;
        const response = await axios.get(url);
        return response.data.display_name as string;
      }
    );

    // calculate tax
    const increment = localHunt.totalBounty * localBountyLogicConfig.tax;

    // update location if there is
    await step.run("update-local-hunt-location-and-subtract-tax", async () => {
      return prisma.localBounty.update({
        where: {
          id: localHuntId,
        },
        select: {
          location: true,
        },
        data: { location, bountyClaimed: { increment } },
      });
    });

    // send tax to pots
    await step.sendEvent("update-pots-balance", {
      name: "pots/balance-updated",
      data: { amount: increment },
    });

    // send telegram message for listed local hunt event with link.
    const bountyLink = `${env.NEXT_PUBLIC_APP_URL}/app/local-bounty/${localHunt.id}`;
    const message = `<b>New Local Bounty Hunt Contest! 🏆</b>

<b>Title:</b> ${localHunt.title}
<b>Total Bounty:</b> ${localHunt.totalBounty.toFixed(2)} Pi tokens
<b>Location:</b> Latitude: ${localHunt.centerLatitude}, Longitude: ${
      localHunt.centerLongitude
    }
<b>Radius:</b> ${localHunt.radius} km
<b>Location Display:</b> ${location} 

<a href="${bountyLink}">Join now</a> and plant or verify trees within the specified radius to earn your share of the bounty! 🌳💚

`;

    await step.sendEvent("send-new-bounty-event-notification", {
      name: "notifications/telegram.post",
      data: { message, type: "BROADCAST" },
    });

    // return

    return { message: `${localHunt.title} Bounty deposited!!!` };
  }
);
