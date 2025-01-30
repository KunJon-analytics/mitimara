/*
  Warnings:

  - You are about to drop the column `isPaid` on the `ParticipantReward` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "LocalBounty" ADD COLUMN     "bountyClaimed" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "ParticipantReward" DROP COLUMN "isPaid",
ADD COLUMN     "isClaimed" BOOLEAN NOT NULL DEFAULT false;
