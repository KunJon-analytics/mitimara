import { env } from "@/env.mjs";
import { prisma } from "@/lib/prisma";

export async function getExchangeDetails(id: string) {
  const [exchange, tx] = await prisma.$transaction([
    prisma.pointsForPiExchange.findUnique({
      where: { id },
    }),
    prisma.payment.findFirst({
      where: { purposeId: id, txId: { not: null } },
    }),
  ]);

  if (!exchange) {
    return null;
  }

  return {
    id: exchange.id,
    amount: exchange.amount,
    pointsTraded: exchange.pointsTraded,
    status: exchange.status,
    type: exchange.type,
    lastExchange: exchange.lastExchange,
    createdAt: exchange.createdAt,
    piTransactionLink: tx
      ? `${env.PI_EXPLORER_LINK}/tx/${tx.txId}` // Replace with actual Pi explorer URL structure
      : null,
  };
}
