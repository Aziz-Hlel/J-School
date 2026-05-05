/*
  Warnings:

  - You are about to drop the column `sessionId` on the `extraCurriculars` table. All the data in the column will be lost.
  - You are about to drop the column `titleId` on the `extraCurriculars` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[extraCurricularId]` on the table `names` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[extraCurricularId]` on the table `sessions` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "extraCurriculars" DROP CONSTRAINT "extraCurriculars_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "extraCurriculars" DROP CONSTRAINT "extraCurriculars_titleId_fkey";

-- DropIndex
DROP INDEX "extraCurriculars_sessionId_key";

-- DropIndex
DROP INDEX "extraCurriculars_titleId_key";

-- AlterTable
ALTER TABLE "extraCurriculars" DROP COLUMN "sessionId",
DROP COLUMN "titleId";

-- AlterTable
ALTER TABLE "names" ADD COLUMN     "extraCurricularId" UUID;

-- AlterTable
ALTER TABLE "sessions" ADD COLUMN     "extraCurricularId" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "names_extraCurricularId_key" ON "names"("extraCurricularId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_extraCurricularId_key" ON "sessions"("extraCurricularId");

-- AddForeignKey
ALTER TABLE "names" ADD CONSTRAINT "names_extraCurricularId_fkey" FOREIGN KEY ("extraCurricularId") REFERENCES "extraCurriculars"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_extraCurricularId_fkey" FOREIGN KEY ("extraCurricularId") REFERENCES "extraCurriculars"("id") ON DELETE CASCADE ON UPDATE CASCADE;
