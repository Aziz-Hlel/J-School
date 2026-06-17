/*
  Warnings:

  - You are about to drop the column `week` on the `calendars` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "calendars_schoolId_week_idx";

-- AlterTable
ALTER TABLE "calendars" DROP COLUMN "week";

-- CreateIndex
CREATE INDEX "calendars_schoolId_startDate_idx" ON "calendars"("schoolId", "startDate");
