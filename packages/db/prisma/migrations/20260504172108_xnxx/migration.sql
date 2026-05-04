/*
  Warnings:

  - You are about to drop the column `description` on the `extraCurriculars` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `extraCurriculars` table. All the data in the column will be lost.
  - You are about to drop the `specialSessions` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[titleId]` on the table `extraCurriculars` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `schoolId` to the `extraCurriculars` table without a default value. This is not possible if the table is not empty.
  - Added the required column `titleId` to the `extraCurriculars` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "extraCurriculars" DROP CONSTRAINT "extraCurriculars_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "extraCurriculars" DROP CONSTRAINT "extraCurriculars_teacherId_fkey";

-- AlterTable
ALTER TABLE "extraCurriculars" DROP COLUMN "description",
DROP COLUMN "title",
ADD COLUMN     "schoolId" UUID NOT NULL,
ADD COLUMN     "titleId" UUID NOT NULL,
ALTER COLUMN "teacherId" DROP NOT NULL;

-- DropTable
DROP TABLE "specialSessions";

-- CreateTable
CREATE TABLE "names" (
    "id" UUID NOT NULL,
    "en" VARCHAR(255) NOT NULL,
    "fr" VARCHAR(255) NOT NULL,
    "ar" VARCHAR(255) NOT NULL,
    "schoolId" UUID NOT NULL,

    CONSTRAINT "names_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" UUID NOT NULL,
    "type" "SessionType" NOT NULL,
    "day" DATE NOT NULL,
    "startTime" TIME NOT NULL,
    "endTime" TIME,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "names_en_schoolId_key" ON "names"("en", "schoolId");

-- CreateIndex
CREATE UNIQUE INDEX "names_fr_schoolId_key" ON "names"("fr", "schoolId");

-- CreateIndex
CREATE UNIQUE INDEX "names_ar_schoolId_key" ON "names"("ar", "schoolId");

-- CreateIndex
CREATE UNIQUE INDEX "extraCurriculars_titleId_key" ON "extraCurriculars"("titleId");

-- AddForeignKey
ALTER TABLE "names" ADD CONSTRAINT "names_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "extraCurriculars" ADD CONSTRAINT "extraCurriculars_titleId_fkey" FOREIGN KEY ("titleId") REFERENCES "names"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "extraCurriculars" ADD CONSTRAINT "extraCurriculars_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "extraCurriculars" ADD CONSTRAINT "extraCurriculars_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "teachers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "extraCurriculars" ADD CONSTRAINT "extraCurriculars_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;
