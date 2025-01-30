import { revalidatePath } from "next/cache";

import { localBountyLogicConfig, subscriptionConfig } from "@/config/site";
import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma";
import { $Enums } from "@prisma/client";

type CompleteTasksParams = {
  paymentId: string;
  purposeId: string;
  type: $Enums.PiTransactionType;
};

export const completeCriticalTasks = async ({
  paymentId,
  purposeId,
  type,
}: CompleteTasksParams) => {
  if (type === "SUBSCRIBE") {
    await prisma.user.update({
      where: {
        id: purposeId,
      },

      data: { points: { increment: subscriptionConfig.userPointsPerPi } },
    });
  }
  if (type === "LOCAL_BOUNTY") {
    await prisma.localBounty.update({
      where: {
        id: purposeId,
      },

      data: {
        paymentId,
        creator: {
          update: {
            points: {
              increment: localBountyLogicConfig.minCreatorPoints * 3,
            },
          },
        },
      },
    });
  }
  revalidatePath("/app");

  await inngest.send({
    name: "payments/payment-completed",
    data: {
      paymentId,
    },
  });
};
