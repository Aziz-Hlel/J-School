-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'CREDIT', 'CHEQUE', 'TRANSFER', 'OTHER');

-- CreateTable
CREATE TABLE "payments" (
    "id" UUID NOT NULL,
    "feeItemId" UUID NOT NULL,
    "method" "PaymentMethod" NOT NULL DEFAULT 'TRANSFER',
    "reference" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payments_feeItemId_key" ON "payments"("feeItemId");

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_feeItemId_fkey" FOREIGN KEY ("feeItemId") REFERENCES "feeItems"("id") ON DELETE CASCADE ON UPDATE CASCADE;
