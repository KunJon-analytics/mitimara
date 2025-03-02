/*
  Warnings:

  - Added the required column `pointsTraded` to the `PointsForPiExchange` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PointsForPiExchange" ADD COLUMN     "pointsTraded" DOUBLE PRECISION NOT NULL;
