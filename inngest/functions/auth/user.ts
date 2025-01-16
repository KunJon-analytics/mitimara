import { siteConfig } from "@/config/site";
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
          const data =
            userReferrer.id === createdUser.id
              ? { referrer: null }
              : { noOfReferrals: { increment: 1 } };

          return prisma.user.update({
            where: {
              id: userReferrer.id,
            },

            data,
          });
        });
      }
    }

    // send TG Admin message for new user
    const message = `<b>Welcome to ${siteConfig.name}, ${createdUser.username}! 🌳</b>

We're thrilled to have you join our green community. Together, we can make the world a greener place, one tree at a time. 🌍💚

Happy tree planting and Pi earning! 🚀

<b>Your MitiMara Team</b>
`;

    await step.sendEvent("send-new-user-notification", {
      name: "notifications/telegram.post",
      data: { message, type: "BROADCAST" },
    });
    // send welcome email to user

    // return

    return { message: `New user: ${createdUser.username} created!!!` };
  }
);
