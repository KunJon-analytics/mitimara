import { NextResponse } from "next/server";
import axios from "axios";

import prisma from "@/lib/prisma";
import platformAPIClient from "@/lib/pi/platform-api-client";
import { donationConfig } from "@/config/site";
import { PaymentDTO, PaymentDTOMemo } from "@/types/pi";

export async function POST(req: Request) {
  try {
    const { payment }: { payment: PaymentDTO<PaymentDTOMemo> } =
      await req.json();
    const paymentId = payment.identifier;
    const txid = payment?.transaction?.txid as string;
    const txURL = payment?.transaction?._link as string;

    const piPlatformPayment = await platformAPIClient.get<
      PaymentDTO<PaymentDTOMemo>
    >(`/payments/${paymentId}`);

    const dbTransaction = await prisma.payment.findUnique({
      where: { paymentId },
    });

    // payment doesn't exist
    if (!dbTransaction) {
      console.log("[INCOMPLETE_PAYMENT]", "Payment not found");
      return new NextResponse("Payment not found", { status: 400 });
    }

    // check the transaction on the Pi blockchain
    const horizonResponse = await axios.create({ timeout: 20000 }).get(txURL);
    const paymentIdOnBlock = horizonResponse.data.memo;
    console.log(horizonResponse.data);

    // and check other data as well e.g. amount
    if (paymentIdOnBlock !== dbTransaction.paymentId) {
      console.log(
        "[INCOMPLETE_PAYMENT]",
        "Payment id not same with blockchain"
      );
      return new NextResponse("Payment id doesn't match.", { status: 400 });
    }

    // let Pi Servers know that the payment is completed
    await platformAPIClient.post(`/payments/${paymentId}/complete`, {
      txid,
    });

    // check if tx is still at INITIALIZED stage then complete service delivery else
    // just complete tx

    await prisma.payment.update({
      where: { paymentId },
      data: { status: "COMPLETED", txId: txid },
    });

    if (
      dbTransaction.status === "INITIALIZED" &&
      dbTransaction.amount <= piPlatformPayment.data.amount
    ) {
      switch (dbTransaction.type) {
        case "DONATE":
          // move to its own module
          await prisma.user.update({
            where: { id: dbTransaction.purposeId },
            data: {
              points: {
                increment:
                  donationConfig.userPointsPerPi * dbTransaction.amount,
              },
            },
          });
          break;

        default:
          break;
      }
    }

    return new NextResponse(`Handled the incomplete payment ${paymentId}`, {
      status: 200,
    });
  } catch (error) {
    console.log("[INCOMPLETE_PAYMENT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
