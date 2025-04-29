-- CreateTable
CREATE TABLE "RecommendedTree" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "commonName" TEXT NOT NULL,
    "scientificName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT,
    "plantingSeason" TEXT NOT NULL,
    "plantingDepth" TEXT NOT NULL,
    "spacing" TEXT NOT NULL,
    "wateringNeeds" TEXT NOT NULL,
    "sunlightNeeds" TEXT NOT NULL,
    "soilRequirements" TEXT NOT NULL,
    "growthRate" TEXT NOT NULL,
    "matureHeight" TEXT NOT NULL,
    "matureWidth" TEXT NOT NULL,
    "recommendedClimate" TEXT NOT NULL,
    "nativeToRegion" BOOLEAN NOT NULL DEFAULT false,
    "indigenousUses" TEXT,
    "carbonSequestration" TEXT NOT NULL,
    "wildlifeValue" TEXT NOT NULL,
    "otherBenefits" TEXT,
    "plantingTutorialUrl" TEXT,
    "localNurseries" JSONB,
    "recommendationReason" TEXT NOT NULL,
    "recommendedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "RecommendedTree_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RecommendedTree_userId_key" ON "RecommendedTree"("userId");

-- AddForeignKey
ALTER TABLE "RecommendedTree" ADD CONSTRAINT "RecommendedTree_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
