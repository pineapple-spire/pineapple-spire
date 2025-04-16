/*
  Warnings:

  - You are about to drop the column `name` on the `ContactUsData` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `ReportPageData` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ContactUsData" DROP COLUMN "name";

-- AlterTable
ALTER TABLE "ReportPageData" DROP COLUMN "name";
