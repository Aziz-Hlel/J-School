/*
  Warnings:

  - You are about to drop the column `homeworkId` on the `Media` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_homeworkId_fkey";

-- AlterTable
ALTER TABLE "Media" DROP COLUMN "homeworkId";

-- CreateTable
CREATE TABLE "_HomeworkToMedia" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_HomeworkToMedia_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_HomeworkToMedia_B_index" ON "_HomeworkToMedia"("B");

-- AddForeignKey
ALTER TABLE "_HomeworkToMedia" ADD CONSTRAINT "_HomeworkToMedia_A_fkey" FOREIGN KEY ("A") REFERENCES "homework"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HomeworkToMedia" ADD CONSTRAINT "_HomeworkToMedia_B_fkey" FOREIGN KEY ("B") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;
