/*
  Warnings:

  - You are about to drop the column `accountsReveivable` on the `FinancialData` table. All the data in the column will be lost.
  - Added the required column `accountsReceivable` to the `FinancialData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FinancialData" DROP COLUMN "accountsReveivable",
ADD COLUMN     "accountsReceivable" DOUBLE PRECISION NOT NULL;
