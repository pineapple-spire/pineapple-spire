-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'AUDITOR', 'ANALYST', 'EXECUTIVE');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('ACTIVE', 'RESOLVED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StressScenario" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "excelWorkbookUrl" TEXT NOT NULL,

    CONSTRAINT "StressScenario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_us_data" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "contact_us_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report_page_data" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "problem" TEXT NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "report_page_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StressTest1Scenario" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StressTest1Scenario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StressTest2Scenario" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "initialPercent" DOUBLE PRECISION NOT NULL,
    "baseRevenue" DOUBLE PRECISION NOT NULL,
    "growthRate" DOUBLE PRECISION NOT NULL,
    "startYear" INTEGER NOT NULL,
    "totalYears" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StressTest2Scenario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StressTest3Scenario" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "annualRate" DOUBLE PRECISION NOT NULL,
    "events" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StressTest3Scenario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StressTest4Scenario" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "initialExpense" DOUBLE PRECISION NOT NULL,
    "increaseRate" DOUBLE PRECISION NOT NULL,
    "returnRate" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StressTest4Scenario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StressTest5Scenario" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "presentValue" DOUBLE PRECISION NOT NULL,
    "interestRate" DOUBLE PRECISION NOT NULL,
    "term" INTEGER NOT NULL,
    "fullyFunded" DOUBLE PRECISION NOT NULL,
    "contributions" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StressTest5Scenario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinancialData" (
    "year" INTEGER NOT NULL,
    "revenue" DOUBLE PRECISION NOT NULL,
    "costContracting" DOUBLE PRECISION NOT NULL,
    "overhead" DOUBLE PRECISION NOT NULL,
    "salariesAndBenefits" DOUBLE PRECISION NOT NULL,
    "rentAndOverhead" DOUBLE PRECISION NOT NULL,
    "depreciationAndAmortization" DOUBLE PRECISION NOT NULL,
    "interest" DOUBLE PRECISION NOT NULL,
    "interestIncome" DOUBLE PRECISION NOT NULL,
    "interestExpense" DOUBLE PRECISION NOT NULL,
    "gainOnDisposalAssets" DOUBLE PRECISION NOT NULL,
    "otherIncome" DOUBLE PRECISION NOT NULL,
    "incomeTaxes" DOUBLE PRECISION NOT NULL,
    "cashAndEquivalents" DOUBLE PRECISION NOT NULL,
    "accountsReceivable" DOUBLE PRECISION NOT NULL,
    "inventory" DOUBLE PRECISION NOT NULL,
    "propertyPlantAndEquipment" DOUBLE PRECISION NOT NULL,
    "investment" DOUBLE PRECISION NOT NULL,
    "accountsPayable" DOUBLE PRECISION NOT NULL,
    "currentDebtService" DOUBLE PRECISION NOT NULL,
    "taxesPayable" DOUBLE PRECISION NOT NULL,
    "longTermDebtService" DOUBLE PRECISION NOT NULL,
    "loansPayable" DOUBLE PRECISION NOT NULL,
    "equityCapital" DOUBLE PRECISION NOT NULL,
    "retainedEarnings" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "FinancialData_pkey" PRIMARY KEY ("year")
);

-- CreateTable
CREATE TABLE "ForecastData" (
    "year" INTEGER NOT NULL,
    "revenue" DOUBLE PRECISION NOT NULL,
    "netSales" DOUBLE PRECISION NOT NULL,
    "costContracting" DOUBLE PRECISION NOT NULL,
    "overhead" DOUBLE PRECISION NOT NULL,
    "costGoodsSold" DOUBLE PRECISION NOT NULL,
    "grossProfit" DOUBLE PRECISION NOT NULL,
    "grossMarginPercent" DOUBLE PRECISION NOT NULL,
    "salariesAndBenefits" DOUBLE PRECISION NOT NULL,
    "rentAndOverhead" DOUBLE PRECISION NOT NULL,
    "depreciationAndAmortization" DOUBLE PRECISION NOT NULL,
    "interest" DOUBLE PRECISION NOT NULL,
    "totalOperatingExpenses" DOUBLE PRECISION NOT NULL,
    "operatingExpensesPercent" DOUBLE PRECISION NOT NULL,
    "profitFromOperations" DOUBLE PRECISION NOT NULL,
    "profitFromOperationsPercent" DOUBLE PRECISION NOT NULL,
    "interestIncome" DOUBLE PRECISION NOT NULL,
    "interestExpense" DOUBLE PRECISION NOT NULL,
    "gainOnDisposalAssets" DOUBLE PRECISION NOT NULL,
    "otherIncome" DOUBLE PRECISION NOT NULL,
    "totalOtherIncome" DOUBLE PRECISION NOT NULL,
    "totalOtherIncomePercent" DOUBLE PRECISION NOT NULL,
    "incomeBeforeIncomeTaxes" DOUBLE PRECISION NOT NULL,
    "preTaxIncomePercent" DOUBLE PRECISION NOT NULL,
    "incomeTaxes" DOUBLE PRECISION NOT NULL,
    "netIncome" DOUBLE PRECISION NOT NULL,
    "netIncomePercent" DOUBLE PRECISION NOT NULL,
    "cashAndEquivalents" DOUBLE PRECISION NOT NULL,
    "accountsReceivable" DOUBLE PRECISION NOT NULL,
    "inventory" DOUBLE PRECISION NOT NULL,
    "totalCurrentAssets" DOUBLE PRECISION NOT NULL,
    "propertyPlantAndEquipment" DOUBLE PRECISION NOT NULL,
    "investment" DOUBLE PRECISION NOT NULL,
    "totalLongTermAssets" DOUBLE PRECISION NOT NULL,
    "totalAssets" DOUBLE PRECISION NOT NULL,
    "accountsPayable" DOUBLE PRECISION NOT NULL,
    "currentDebtService" DOUBLE PRECISION NOT NULL,
    "taxesPayable" DOUBLE PRECISION NOT NULL,
    "totalCurrentLiabilities" DOUBLE PRECISION NOT NULL,
    "longTermDebtService" DOUBLE PRECISION NOT NULL,
    "loansPayable" DOUBLE PRECISION NOT NULL,
    "totalLongTermLiabilities" DOUBLE PRECISION NOT NULL,
    "totalLiabilities" DOUBLE PRECISION NOT NULL,
    "equityCapital" DOUBLE PRECISION NOT NULL,
    "retainedEarnings" DOUBLE PRECISION NOT NULL,
    "totalStockholdersEquity" DOUBLE PRECISION NOT NULL,
    "totalLiabilitiesAndEquity" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ForecastData_pkey" PRIMARY KEY ("year")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
