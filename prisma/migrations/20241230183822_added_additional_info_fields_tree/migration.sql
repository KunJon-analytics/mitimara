/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Tree` will be added. If there are existing duplicate values, this will fail.
  - The required column `code` was added to the `Tree` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Tree" ADD COLUMN     "additionalInfo" TEXT,
ADD COLUMN     "code" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TreeVerification" ADD COLUMN     "additionalInfo" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Tree_code_key" ON "Tree"("code");
