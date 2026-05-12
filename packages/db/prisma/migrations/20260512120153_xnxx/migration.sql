-- CreateEnum
CREATE TYPE "FeeItemStatus" AS ENUM ('PAID', 'UNPAID', 'PARTIALLY_PAID');

-- AlterTable
ALTER TABLE "feeItems" ADD COLUMN     "status" "FeeItemStatus" NOT NULL DEFAULT 'UNPAID';
