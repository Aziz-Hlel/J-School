-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "role" "UserRole",
ADD COLUMN     "studentId" UUID;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;
