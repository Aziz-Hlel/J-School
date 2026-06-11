/*
  Warnings:

  - You are about to drop the column `classUnit` on the `timetable` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "timetable" DROP COLUMN "classUnit",
ADD COLUMN     "room" TEXT;
