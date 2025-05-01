/*
  Warnings:

  - You are about to drop the column `totalCurrentAsssets` on the `ForecastData` table. All the data in the column will be lost.
  - Added the required column `totalCurrentAssets` to the `ForecastData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ForecastData" DROP COLUMN "totalCurrentAsssets",
ADD COLUMN     "totalCurrentAssets" DOUBLE PRECISION NOT NULL;
