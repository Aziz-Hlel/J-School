-- DropIndex
DROP INDEX "fees_schoolId_studentId_key";

-- CreateIndex
CREATE INDEX "fees_schoolId_studentId_idx" ON "fees"("schoolId", "studentId");
