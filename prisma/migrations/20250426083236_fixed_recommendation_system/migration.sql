/*
  Warnings:

  - You are about to drop the `RecommendedTree` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "TreeRecommendationStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- DropForeignKey
ALTER TABLE "RecommendedTree" DROP CONSTRAINT "RecommendedTree_userId_fkey";

-- DropTable
DROP TABLE "RecommendedTree";

-- CreateTable
CREATE TABLE "TreeRecommendation" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "status" "TreeRecommendationStatus" NOT NULL DEFAULT 'PENDING',
    "userId" TEXT NOT NULL,
    "commonName" TEXT,
    "scientificName" TEXT,
    "description" TEXT,
    "imageUrl" TEXT,
    "plantingSeason" TEXT,
    "plantingDepth" TEXT,
    "spacing" TEXT,
    "wateringNeeds" TEXT,
    "sunlightNeeds" TEXT,
    "soilRequirements" TEXT,
    "growthRate" TEXT,
    "matureHeight" TEXT,
    "matureWidth" TEXT,
    "recommendedClimate" TEXT,
    "nativeToRegion" BOOLEAN NOT NULL DEFAULT false,
    "indigenousUses" TEXT,
    "carbonSequestration" TEXT,
    "wildlifeValue" TEXT,
    "otherBenefits" TEXT,
    "plantingTutorialUrl" TEXT,
    "localNurseries" JSONB,
    "recommendationReason" TEXT,
    "recommendedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "error" TEXT,

    CONSTRAINT "TreeRecommendation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TreeRecommendation_requestId_key" ON "TreeRecommendation"("requestId");

-- CreateIndex
CREATE UNIQUE INDEX "TreeRecommendation_userId_key" ON "TreeRecommendation"("userId");

-- AddForeignKey
ALTER TABLE "TreeRecommendation" ADD CONSTRAINT "TreeRecommendation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
