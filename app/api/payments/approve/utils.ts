import { subscriptionConfig } from "@/config/site";
import prisma from "@/lib/prisma";
import { $Enums } from "@prisma/client";

type ApprovalParams = {
  type: $Enums.PiTransactionType;
  amount: number;
  purposeId: string;
};

export const verifyPaymentApproval = async ({
  amount,
  purposeId,
  type,
}: ApprovalParams) => {
  switch (type) {
    case "DONATE":
      return true;

    case "SUBSCRIBE":
      if (amount < subscriptionConfig.fee) {
        return false;
      }
      return true;

    case "LOCAL_BOUNTY":
      const localBounty = await prisma.localBounty.findUnique({
        where: { id: purposeId },
        select: { totalBounty: true },
      });

      if (!localBounty || amount < localBounty.totalBounty) {
        return false;
      }
      return true;

    default:
      return true;
  }
};
