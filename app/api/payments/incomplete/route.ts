import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import platformAPIClient from "@/lib/pi/platform-api-client";
import { PaymentDTO, PaymentDTOMemo } from "@/types/pi";
import { inngest } from "@/inngest/client";
import { verifyPaymentCompletion } from "../complete/utils";

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

    const dbPayment = await prisma.payment.findUnique({
      where: { paymentId },
    });

    // payment doesn't exist
    if (!dbPayment) {
      console.error("[INCOMPLETE_PAYMENT]", "Payment not found");
      return new NextResponse("Payment not found", { status: 400 });
    }

    const isVerified = await verifyPaymentCompletion({
      dbPayment,
      txURL,
    });

    if (!isVerified) {
      return new NextResponse("Unverified Payment", { status: 400 });
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
      dbPayment.status === "INITIALIZED" &&
      dbPayment.amount <= piPlatformPayment.data.amount
    ) {
      // just send complete payment event
      await inngest.send({
        name: "payments/payment-completed",
        data: {
          paymentId,
        },
      });
    }

    return new NextResponse(`Handled the incomplete payment ${paymentId}`, {
      status: 200,
    });
  } catch (error) {
    console.error("[INCOMPLETE_PAYMENT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
