/*
  Warnings:

  - You are about to drop the column `sessionId` on the `attendances` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[schoolId,week,timetableId,studentId]` on the table `attendances` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `timetableId` to the `attendances` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "attendances" DROP CONSTRAINT "attendances_sessionId_fkey";

-- DropIndex
DROP INDEX "attendances_schoolId_week_sessionId_studentId_idx";

-- DropIndex
DROP INDEX "attendances_schoolId_week_studentId_sessionId_idx";

-- DropIndex
DROP INDEX "attendances_studentId_sessionId_week_key";

-- AlterTable
ALTER TABLE "attendances" DROP COLUMN "sessionId",
ADD COLUMN     "timetableId" UUID NOT NULL;

-- CreateIndex
CREATE INDEX "attendances_schoolId_week_studentId_timetableId_idx" ON "attendances"("schoolId", "week", "studentId", "timetableId");

-- CreateIndex
CREATE UNIQUE INDEX "attendances_schoolId_week_timetableId_studentId_key" ON "attendances"("schoolId", "week", "timetableId", "studentId");

-- AddForeignKey
ALTER TABLE "attendances" ADD CONSTRAINT "attendances_timetableId_fkey" FOREIGN KEY ("timetableId") REFERENCES "timetable"("id") ON DELETE CASCADE ON UPDATE CASCADE;
