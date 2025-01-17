import { $Enums } from "@prisma/client";

export const getTGPaymentType = (type: $Enums.PiTransactionType) => {
  switch (type) {
    case "DONATE":
      return "Donation";

    case "SUBSCRIBE":
      return "Subscription";

    default:
      return "Donation";
  }
};
