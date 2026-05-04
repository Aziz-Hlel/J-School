/*
  Warnings:

  - Changed the type of `day` on the `sessions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "sessions" ADD COLUMN     "date" DATE,
DROP COLUMN "day",
ADD COLUMN     "day" "DayOfWeek" NOT NULL;
