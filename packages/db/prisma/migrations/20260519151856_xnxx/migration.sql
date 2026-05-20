/*
  Warnings:

  - You are about to drop the column `studentId` on the `homework` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "homework" DROP CONSTRAINT "homework_studentId_fkey";

-- AlterTable
ALTER TABLE "homework" DROP COLUMN "studentId";

-- CreateTable
CREATE TABLE "student_homework" (
    "id" UUID NOT NULL,
    "studentId" UUID NOT NULL,
    "homeworkId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_homework_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "student_homework_studentId_homeworkId_key" ON "student_homework"("studentId", "homeworkId");

-- AddForeignKey
ALTER TABLE "student_homework" ADD CONSTRAINT "student_homework_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_homework" ADD CONSTRAINT "student_homework_homeworkId_fkey" FOREIGN KEY ("homeworkId") REFERENCES "homework"("id") ON DELETE CASCADE ON UPDATE CASCADE;
