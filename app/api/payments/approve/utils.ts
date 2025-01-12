import { $Enums } from "@prisma/client";

export const verifyPaymentApproval = (
  type: $Enums.PiTransactionType,
  amount: number
) => {
  switch (type) {
    case "DONATE":
      return true;

    default:
      return true;
  }
  // sample error
  //  if (currentPayment.data.amount !== siteConfig.businessLogic.tipsAmount) {
  //    console.log("[TIPS_APPROVE]", "wrong payment amount");
  //    return new NextResponse("Unauthorized", { status: 401 });
  //  }
};
