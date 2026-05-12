/*
  Warnings:

  - You are about to drop the column `messageId` on the `Media` table. All the data in the column will be lost.
  - You are about to drop the `messages` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_messageId_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_extraCurricularId_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_schoolId_fkey";

-- AlterTable
ALTER TABLE "Media" DROP COLUMN "messageId",
ADD COLUMN     "postId" UUID;

-- DropTable
DROP TABLE "messages";

-- CreateTable
CREATE TABLE "posts" (
    "id" UUID NOT NULL,
    "content" TEXT,
    "extraCurricularId" UUID NOT NULL,
    "schoolId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "posts_schoolId_extraCurricularId_createdAt_idx" ON "posts"("schoolId", "extraCurricularId", "createdAt" DESC);

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_extraCurricularId_fkey" FOREIGN KEY ("extraCurricularId") REFERENCES "extraCurriculars"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
