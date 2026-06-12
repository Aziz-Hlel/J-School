-- AlterEnum
ALTER TYPE "AttendanceStatus" ADD VALUE 'EXCLUDED';

-- AlterTable
ALTER TABLE "attendances" ADD COLUMN     "note" VARCHAR(255);
