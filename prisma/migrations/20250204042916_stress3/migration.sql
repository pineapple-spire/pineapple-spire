/*
  Warnings:

  - Added the required column `excelWorkbookUrl` to the `StressScenario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StressScenario" ADD COLUMN     "excelWorkbookUrl" TEXT NOT NULL;
