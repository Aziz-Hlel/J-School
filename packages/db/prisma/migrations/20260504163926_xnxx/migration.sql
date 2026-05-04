/*
  Warnings:

  - You are about to drop the column `classId` on the `students` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_classId_fkey";

-- AlterTable
ALTER TABLE "specialSessions" ALTER COLUMN "endTime" DROP NOT NULL;

-- AlterTable
ALTER TABLE "students" DROP COLUMN "classId",
ADD COLUMN     "classroomId" UUID;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "classrooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
