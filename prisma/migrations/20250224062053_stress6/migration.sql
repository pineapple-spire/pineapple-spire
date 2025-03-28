-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

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
CREATE TABLE "AuditData" (
    "id" SERIAL NOT NULL,
    "revenueYear1" DOUBLE PRECISION NOT NULL,
    "revenueYear2" DOUBLE PRECISION NOT NULL,
    "revenueYear3" DOUBLE PRECISION NOT NULL,
    "netSalesYear1" DOUBLE PRECISION NOT NULL,
    "netSalesYear2" DOUBLE PRECISION NOT NULL,
    "netSalesYear3" DOUBLE PRECISION NOT NULL,
    "costContractingYear1" DOUBLE PRECISION NOT NULL,
    "costContractingYear2" DOUBLE PRECISION NOT NULL,
    "costContractingYear3" DOUBLE PRECISION NOT NULL,
    "overheadYear1" DOUBLE PRECISION NOT NULL,
    "overheadYear2" DOUBLE PRECISION NOT NULL,
    "overheadYear3" DOUBLE PRECISION NOT NULL,
    "costOfGoodsSoldYear1" DOUBLE PRECISION NOT NULL,
    "costOfGoodsSoldYear2" DOUBLE PRECISION NOT NULL,
    "costOfGoodsSoldYear3" DOUBLE PRECISION NOT NULL,
    "grossProfitYear1" DOUBLE PRECISION NOT NULL,
    "grossProfitYear2" DOUBLE PRECISION NOT NULL,
    "grossProfitYear3" DOUBLE PRECISION NOT NULL,
    "grossMarginYear1" DOUBLE PRECISION NOT NULL,
    "grossMarginYear2" DOUBLE PRECISION NOT NULL,
    "grossMarginYear3" DOUBLE PRECISION NOT NULL,
    "salariesAndBenefitsYear1" DOUBLE PRECISION NOT NULL,
    "salariesAndBenefitsYear2" DOUBLE PRECISION NOT NULL,
    "salariesAndBenefitsYear3" DOUBLE PRECISION NOT NULL,
    "rentAndOverheadYear1" DOUBLE PRECISION NOT NULL,
    "rentAndOverheadYear2" DOUBLE PRECISION NOT NULL,
    "rentAndOverheadYear3" DOUBLE PRECISION NOT NULL,
    "depreciationAndAmortizationYear1" DOUBLE PRECISION NOT NULL,
    "depreciationAndAmortizationYear2" DOUBLE PRECISION NOT NULL,
    "depreciationAndAmortizationYear3" DOUBLE PRECISION NOT NULL,
    "interestYear1" DOUBLE PRECISION NOT NULL,
    "interestYear2" DOUBLE PRECISION NOT NULL,
    "interestYear3" DOUBLE PRECISION NOT NULL,
    "totalOperatingExpensesYear1" DOUBLE PRECISION NOT NULL,
    "totalOperatingExpensesYear2" DOUBLE PRECISION NOT NULL,
    "totalOperatingExpensesYear3" DOUBLE PRECISION NOT NULL,
    "operatingExpensesPercentYear1" DOUBLE PRECISION NOT NULL,
    "operatingExpensesPercentYear2" DOUBLE PRECISION NOT NULL,
    "operatingExpensesPercentYear3" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuditData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
