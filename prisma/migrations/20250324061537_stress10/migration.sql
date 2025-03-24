-- CreateTable
CREATE TABLE "ReportPageData" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "problem" TEXT NOT NULL,

    CONSTRAINT "ReportPageData_pkey" PRIMARY KEY ("id")
);
