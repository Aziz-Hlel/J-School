/*
  Warnings:

  - Added the required column `grade` to the `extraCurriculars` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "extraCurriculars" ADD COLUMN     "grade" "ClassGrade" NOT NULL;

-- CreateIndex
CREATE INDEX "names_en_idx" ON "names"("en");

-- CreateIndex
CREATE INDEX "names_fr_idx" ON "names"("fr");

-- CreateIndex
CREATE INDEX "names_ar_idx" ON "names"("ar");
