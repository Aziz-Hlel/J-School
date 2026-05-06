-- DropIndex
DROP INDEX "attendances_sessionId_week_idx";

-- CreateIndex
CREATE INDEX "attendances_schoolId_week_studentId_sessionId_idx" ON "attendances"("schoolId", "week", "studentId", "sessionId");

-- CreateIndex
CREATE INDEX "attendances_schoolId_week_sessionId_studentId_idx" ON "attendances"("schoolId", "week", "sessionId", "studentId");
