/*
  Warnings:

  - Added the required column `costGoodsSold` to the `ForecastData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `grossMarginPercent` to the `ForecastData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `grossProfit` to the `ForecastData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `incomeBeforeIncomeTaxes` to the `ForecastData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `netIncome` to the `ForecastData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `netIncomePercent` to the `ForecastData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `netSales` to the `ForecastData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `operatingExpensesPercent` to the `ForecastData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `preTaxIncomePercent` to the `ForecastData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profitFromOperations` to the `ForecastData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profitFromOperationsPercent` to the `ForecastData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalAssets` to the `ForecastData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalCurrentAsssets` to the `ForecastData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalCurrentLiabilities` to the `ForecastData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalLiabilities` to the `ForecastData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalLiabilitiesAndEquity` to the `ForecastData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalLongTermAssets` to the `ForecastData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalLongTermLiabilities` to the `ForecastData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalOperatingExpenses` to the `ForecastData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalOtherIncome` to the `ForecastData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalOtherIncomePercent` to the `ForecastData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalStockholdersEquity` to the `ForecastData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ForecastData" ADD COLUMN     "costGoodsSold" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "grossMarginPercent" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "grossProfit" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "incomeBeforeIncomeTaxes" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "netIncome" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "netIncomePercent" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "netSales" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "operatingExpensesPercent" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "preTaxIncomePercent" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "profitFromOperations" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "profitFromOperationsPercent" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "totalAssets" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "totalCurrentAsssets" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "totalCurrentLiabilities" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "totalLiabilities" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "totalLiabilitiesAndEquity" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "totalLongTermAssets" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "totalLongTermLiabilities" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "totalOperatingExpenses" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "totalOtherIncome" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "totalOtherIncomePercent" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "totalStockholdersEquity" DOUBLE PRECISION NOT NULL;
