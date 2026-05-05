/*
  Warnings:

  - You are about to drop the column `schoolId` on the `names` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "names" DROP CONSTRAINT "names_schoolId_fkey";

-- AlterTable
ALTER TABLE "names" DROP COLUMN "schoolId";
