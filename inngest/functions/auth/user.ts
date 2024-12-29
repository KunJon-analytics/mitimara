import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma";

export const userCreatedEvent = inngest.createFunction(
  { id: "new-user-created" },
  { event: "auth/user.created" },
  async ({ event, step }) => {
    const { userId } = event.data;

    // get user
    const createdUser = await step.run("get-created-user", async () => {
      return prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: { referrer: true, id: true, username: true },
      });
    });

    // return if no user
    if (!createdUser) {
      return { message: "Invalid User Id" };
    }

    // if referrer username
    if (!!createdUser.referrer) {
      // get referrer
      const userReferrer = await step.run(
        "get-user-referrer-by-username",
        async () => {
          return prisma.user.findFirst({
            where: {
              username: createdUser.referrer ?? "",
            },
            select: { id: true },
          });
        }
      );

      // if not found update user referrer to null
      if (!userReferrer) {
        await step.run("update-referrer-username-to-null", async () => {
          return prisma.user.update({
            where: {
              id: createdUser.id,
            },
            data: { referrer: null },
            select: { id: true },
          });
        });
      } else {
        // increase user referrer count
        await step.run("upsert-referral-for-referrer-and-user", async () => {
          return prisma.user.update({
            where: {
              id: userReferrer.id,
            },

            data: { noOfReferrals: { increment: 1 } },
          });
        });
      }
    }

    // send TG Admin message for new user
    const message = `<b>New User Registration</b>

<b>Username:</b> ${createdUser.username}
<b>Referrer:</b> ${createdUser.referrer}

A new user has registered on the platform. Please review their details and ensure they have a smooth onboarding experience.

Thank you for your attention!

`;

    await step.sendEvent("send-new-user-notification", {
      name: "notifications/telegram.send",
      data: { message, type: "DEV_MODE" },
    });
    // send welcome email to user

    // return

    return { message: `New user: ${createdUser.username} created!!!` };
  }
);
