/*
  Warnings:

  - You are about to drop the column `cpr` on the `student_profiles` table. All the data in the column will be lost.
  - Added the required column `vaccine` to the `student_profiles` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "VaccineStatus" AS ENUM ('NOT_VACCINATED', 'PARTIALLY_VACCINATED', 'FULLY_VACCINATED');

-- AlterTable
ALTER TABLE "student_profiles" DROP COLUMN "cpr",
ADD COLUMN     "vaccineNotes" TEXT,
DROP COLUMN "vaccine",
ADD COLUMN     "vaccine" "VaccineStatus" NOT NULL;
