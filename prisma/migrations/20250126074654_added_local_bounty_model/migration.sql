-- CreateEnum
CREATE TYPE "RewardType" AS ENUM ('PLANTER', 'VERIFIER');

-- AlterEnum
ALTER TYPE "PiTransactionType" ADD VALUE 'LOCAL_BOUNTY';

-- AlterTable
ALTER TABLE "Tree" ADD COLUMN     "localBountyId" TEXT;

-- CreateTable
CREATE TABLE "LocalBounty" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "totalBounty" DOUBLE PRECISION NOT NULL,
    "radius" DOUBLE PRECISION NOT NULL,
    "centerLatitude" DOUBLE PRECISION NOT NULL,
    "centerLongitude" DOUBLE PRECISION NOT NULL,
    "location" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "paymentId" TEXT,
    "creatorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LocalBounty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParticipantReward" (
    "id" TEXT NOT NULL,
    "localBountyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "treesPlanted" INTEGER NOT NULL DEFAULT 0,
    "treesVerified" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ParticipantReward_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ParticipantReward_localBountyId_userId_key" ON "ParticipantReward"("localBountyId", "userId");

-- AddForeignKey
ALTER TABLE "Tree" ADD CONSTRAINT "Tree_localBountyId_fkey" FOREIGN KEY ("localBountyId") REFERENCES "LocalBounty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocalBounty" ADD CONSTRAINT "LocalBounty_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipantReward" ADD CONSTRAINT "ParticipantReward_localBountyId_fkey" FOREIGN KEY ("localBountyId") REFERENCES "LocalBounty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipantReward" ADD CONSTRAINT "ParticipantReward_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
