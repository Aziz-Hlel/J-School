/*
  Warnings:

  - Added the required column `sourceType` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "NotificationSourceType" AS ENUM ('CALENDAR', 'TEACHER_COMMENT', 'FEED');

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "sourceType" "NotificationSourceType" NOT NULL;

-- DropEnum
DROP TYPE "NotificationContentType";

-- CreateIndex
CREATE INDEX "calendars_schoolId_week_idx" ON "calendars"("schoolId", "week");
