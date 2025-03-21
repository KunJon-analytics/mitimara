-- CreateTable
CREATE TABLE "AdminLogAction" (
    "id" TEXT NOT NULL,
    "admin" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminLogAction_pkey" PRIMARY KEY ("id")
);
