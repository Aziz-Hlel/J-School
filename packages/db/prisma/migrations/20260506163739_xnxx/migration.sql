/*
  Warnings:

  - A unique constraint covering the columns `[schoolId,assignmentId,day,startTime]` on the table `timetable` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "timetable_schoolId_assignmentId_idx";

-- CreateIndex
CREATE UNIQUE INDEX "timetable_schoolId_assignmentId_day_startTime_key" ON "timetable"("schoolId", "assignmentId", "day", "startTime");
