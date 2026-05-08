/*
  Warnings:

  - A unique constraint covering the columns `[annoucementId,userId]` on the table `reactions` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "reactions_annoucementId_idx";

-- DropIndex
DROP INDEX "reactions_userId_annoucementId_key";

-- CreateIndex
CREATE UNIQUE INDEX "reactions_annoucementId_userId_key" ON "reactions"("annoucementId", "userId");
