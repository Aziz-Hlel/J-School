/*
  Warnings:

  - A unique constraint covering the columns `[schoolId,date]` on the table `aftercare` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "aftercare_schoolId_date_key" ON "aftercare"("schoolId", "date");
