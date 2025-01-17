import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { PaymentDTO, PaymentDTOMemo } from "@/types/pi";
import platformAPIClient from "@/lib/pi/platform-api-client";
import { inngest } from "@/inngest/client";
import { verifyPaymentCompletion } from "./utils";

export async function POST(req: Request) {
  try {
    const {
      paymentId,
      txid,
    }: {
      paymentId: string;
      txid: string;
    } = await req.json();

    const currentPayment = await platformAPIClient.get<
      PaymentDTO<PaymentDTOMemo>
    >(`/payments/${paymentId}`);

    /* 
      DEVELOPER NOTE:
      implement logic here 
      e.g. verify transaction with blockchain data, 
      change payment status to confirmed, add txid and add send 
      completePayment event
     
    */

    // verify with horizon data (amount, payment and txid)

    const payment = await prisma.payment.findUnique({
      where: { paymentId },
      select: { status: true, paymentId: true, amount: true },
    });

    if (payment?.status !== "INITIALIZED") {
      console.error("[COMPLETE_PAYMENT]", "Wrong payment status");
      return new NextResponse("Wrong payment status", { status: 400 });
    }

    const isVerified = await verifyPaymentCompletion({
      dbPayment: payment,
      txURL: currentPayment.data.transaction?._link as string,
    });

    if (!isVerified) {
      return new NextResponse("Unverified Payment", { status: 400 });
    }

    // let Pi server know that the payment is completed
    await platformAPIClient.post(`/payments/${paymentId}/complete`, {
      txid,
    });

    await prisma.payment.update({
      where: { paymentId },
      data: { txId: txid, status: "COMPLETED" },
    });

    await inngest.send({
      name: "payments/payment-completed",
      data: {
        paymentId,
      },
    });

    return new NextResponse(`Completed the payment ${paymentId}`, {
      status: 200,
    });
  } catch (error) {
    console.error("[COMPLETE_PAYMENT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
