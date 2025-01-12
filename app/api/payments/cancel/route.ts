import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";
// import platformAPIClient from "@/lib/pi/platform-api-client";

export async function POST(req: Request) {
  try {
    const {
      paymentId,
    }: {
      paymentId: string;
    } = await req.json();

    /* 
      DEVELOPER NOTE:
      implement logic here 
      e.g. delete pitransaction if already created

    */

    const tx = await prisma.payment.findUnique({
      where: { paymentId },
    });
    if (tx) {
      await prisma.payment.delete({
        where: { paymentId },
      });
    }

    // let Pi Servers know that you're ready
    // await platformAPIClient.post(`/payments/${paymentId}/cancel`);
    return new NextResponse(`Cancelled the payment ${paymentId}`, {
      status: 200,
    });
  } catch (error) {
    console.log("[CANCEL_PI_PAYMENT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
