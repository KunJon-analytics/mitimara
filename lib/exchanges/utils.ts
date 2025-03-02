import { $Enums } from "@prisma/client";

export const getExchangeStatus = (status: $Enums.PointsExchangeStatus) => {
  return status === "PAYMENT_CREATED" ? "PAID" : status;
};

export const getExchangeStatusBadge = (status: $Enums.PointsExchangeStatus) => {
  switch (status) {
    case "DENIED":
      return "destructive";
    case "INITIATED":
      return "outline";
    case "VERIFIED":
      return "default";
    case "PAYMENT_CREATED":
      return "success";

    default:
      return "default";
  }
};
