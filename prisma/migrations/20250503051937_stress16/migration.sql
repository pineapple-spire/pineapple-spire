-- AlterTable
ALTER TABLE "ContactUsData" ADD COLUMN     "archived" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "ReportPageData" ADD COLUMN     "archived" BOOLEAN NOT NULL DEFAULT false;
