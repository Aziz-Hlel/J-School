/*
  Warnings:

  - You are about to drop the column `vaccineNotes` on the `student_profiles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "student_profiles" DROP COLUMN "vaccineNotes";

-- CreateIndex
CREATE INDEX "emergency_contacts_profileId_idx" ON "emergency_contacts"("profileId");
