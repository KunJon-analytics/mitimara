import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import platformAPIClient from "@/lib/pi/platform-api-client";
import { PaymentDTO, PaymentDTOMemo } from "@/types/pi";
import { verifyPaymentApproval } from "./utils";

export async function POST(req: Request) {
  try {
    const {
      paymentId,
    }: {
      paymentId: string;
    } = await req.json();

    const currentPayment = await platformAPIClient.get<
      PaymentDTO<PaymentDTOMemo>
    >(`/payments/${paymentId}`);

    /* 
      DEVELOPER NOTE:
      implement logic here 
      e.g. ensure there is no prev pi payment with payment ID, 
      
      check if amount is right with business logic 
      (use currentPayment type) => u can add helper fn 
      use switch with type (this is where you confirm amount)
    */

    const {
      amount,
      metadata: { purpose: purposeId, type },
    } = currentPayment.data;

    const isVerified = verifyPaymentApproval(type, amount);

    if (!isVerified) {
      return new NextResponse("Unverified Payment", { status: 400 });
    }

    await prisma.payment.create({
      data: {
        amount,
        paymentId,
        purposeId,
        type,
        status: "INITIALIZED",
      },
    });

    // let Pi Servers know that you're ready
    await platformAPIClient.post(`/payments/${paymentId}/approve`);

    return new NextResponse(`Approved the payment ${paymentId}`, {
      status: 200,
    });
  } catch (error) {
    console.error("[PAYMENT_APPROVE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
