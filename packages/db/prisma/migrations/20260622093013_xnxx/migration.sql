-- CreateEnum
CREATE TYPE "HomeworkType" AS ENUM ('STANDARD', 'AI');

-- AlterTable
ALTER TABLE "homework" ADD COLUMN     "type" "HomeworkType" NOT NULL DEFAULT 'STANDARD';
