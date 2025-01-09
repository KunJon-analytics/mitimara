/*
  Warnings:

  - A unique constraint covering the columns `[treeId,verifierId]` on the table `TreeVerification` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "handle" TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "points" SET DEFAULT 10;

-- CreateIndex
CREATE UNIQUE INDEX "TreeVerification_treeId_verifierId_key" ON "TreeVerification"("treeId", "verifierId");
