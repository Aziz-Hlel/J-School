/*
  Warnings:

  - A unique constraint covering the columns `[schoolId,examId,assignementId]` on the table `examSchedules` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "SessionType" AS ENUM ('WEEKLY', 'SPECIAL');

-- CreateTable
CREATE TABLE "extraCurriculars" (
    "id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "sessionId" UUID NOT NULL,
    "teacherId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "extraCurriculars_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "specialSessions" (
    "id" UUID NOT NULL,
    "type" "SessionType" NOT NULL,
    "day" DATE NOT NULL,
    "startTime" TIME NOT NULL,
    "endTime" TIME NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "specialSessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "extraCurriculars_sessionId_key" ON "extraCurriculars"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "examSchedules_schoolId_examId_assignementId_key" ON "examSchedules"("schoolId", "examId", "assignementId");

-- AddForeignKey
ALTER TABLE "extraCurriculars" ADD CONSTRAINT "extraCurriculars_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "specialSessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "extraCurriculars" ADD CONSTRAINT "extraCurriculars_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "teachers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
