/*
  Warnings:

  - You are about to drop the `ContactUsData` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReportPageData` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('ACTIVE', 'RESOLVED', 'ARCHIVED');

-- DropTable
DROP TABLE "ContactUsData";

-- DropTable
DROP TABLE "ReportPageData";

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
