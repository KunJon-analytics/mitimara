-- CreateEnum
CREATE TYPE "PointsExchangeStatus" AS ENUM ('INITIATED', 'VERIFIED', 'PAYMENT_CREATED', 'DENIED');

-- CreateEnum
CREATE TYPE "PointsExchangeType" AS ENUM ('PLANTER_VERIFIER', 'REFERRAL');

-- AlterEnum
ALTER TYPE "PiTransactionType" ADD VALUE 'POINTS_EXCHANGE';

-- CreateTable
CREATE TABLE "PointsForPiExchange" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" "PointsExchangeStatus" NOT NULL DEFAULT 'INITIATED',
    "lastExchange" TIMESTAMP(3) NOT NULL,
    "type" "PointsExchangeType" NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PointsForPiExchange_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PointsForPiExchange" ADD CONSTRAINT "PointsForPiExchange_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
