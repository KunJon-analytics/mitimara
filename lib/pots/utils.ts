import { $Enums } from "@prisma/client";

export const getTGPaymentType = (type: $Enums.PiTransactionType) => {
  switch (type) {
    case "DONATE":
      return "Donation";

    case "SUBSCRIBE":
      return "Subscription";

    case "LOCAL_BOUNTY":
      return "Local Bounty Hunt Deposit";

    default:
      return "Donation";
  }
};
