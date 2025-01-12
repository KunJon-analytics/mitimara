import { subscriptionConfig } from "@/config/site";
import { $Enums } from "@prisma/client";

export const verifyPaymentApproval = (
  type: $Enums.PiTransactionType,
  amount: number
) => {
  switch (type) {
    case "DONATE":
      return true;

    case "SUBSCRIBE":
      if (amount < subscriptionConfig.fee) {
        return false;
      }
      return true;

    default:
      return true;
  }
};
