-- CreateEnum
CREATE TYPE "TreeReportStatus" AS ENUM ('PENDING', 'AGREED', 'DECLINED');

-- CreateTable
CREATE TABLE "TreeReport" (
    "id" TEXT NOT NULL,
    "report" TEXT NOT NULL,
    "status" "TreeReportStatus" NOT NULL DEFAULT 'PENDING',
    "resolver" TEXT,
    "treeId" TEXT NOT NULL,
    "reporterId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TreeReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TreeReport_treeId_key" ON "TreeReport"("treeId");

-- AddForeignKey
ALTER TABLE "TreeReport" ADD CONSTRAINT "TreeReport_treeId_fkey" FOREIGN KEY ("treeId") REFERENCES "Tree"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TreeReport" ADD CONSTRAINT "TreeReport_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
