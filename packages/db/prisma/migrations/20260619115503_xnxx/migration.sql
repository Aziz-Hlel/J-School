/*
  Warnings:

  - You are about to drop the column `emergencyContactName1` on the `student_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `emergencyContactName2` on the `student_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `emergencyContactPhone1` on the `student_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `emergencyContactPhone2` on the `student_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `emergencyContactRelation1` on the `student_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `emergencyContactRelation2` on the `student_profiles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "student_profiles" DROP COLUMN "emergencyContactName1",
DROP COLUMN "emergencyContactName2",
DROP COLUMN "emergencyContactPhone1",
DROP COLUMN "emergencyContactPhone2",
DROP COLUMN "emergencyContactRelation1",
DROP COLUMN "emergencyContactRelation2";

-- CreateTable
CREATE TABLE "emergency_contacts" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "relation" VARCHAR(255) NOT NULL,
    "profileId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "emergency_contacts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "emergency_contacts" ADD CONSTRAINT "emergency_contacts_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "student_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
