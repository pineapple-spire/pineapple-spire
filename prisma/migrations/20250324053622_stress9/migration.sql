-- CreateTable
CREATE TABLE "ContactUsData" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,

    CONSTRAINT "ContactUsData_pkey" PRIMARY KEY ("id")
);
