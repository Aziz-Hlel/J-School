/*
  Warnings:

  - You are about to drop the column `grade` on the `extraCurriculars` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "extraCurriculars_schoolId_grade_idx";

-- AlterTable
ALTER TABLE "extraCurriculars" DROP COLUMN "grade";
