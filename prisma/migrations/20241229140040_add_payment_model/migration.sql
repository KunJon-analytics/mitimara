-- CreateEnum
CREATE TYPE "PiTransactionStatus" AS ENUM ('INITIALIZED', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Payment" (
    "amount" DOUBLE PRECISION NOT NULL,
    "txId" TEXT,
    "paymentId" TEXT NOT NULL,
    "isRefunded" BOOLEAN NOT NULL DEFAULT false,
    "type" "PiTransactionType" NOT NULL,
    "status" "PiTransactionStatus" NOT NULL DEFAULT 'INITIALIZED',
    "purposeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Payment_paymentId_key" ON "Payment"("paymentId");
