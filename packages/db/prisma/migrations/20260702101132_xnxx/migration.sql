/*
  Warnings:

  - You are about to drop the column `studentId` on the `Notification` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_studentId_fkey";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "studentId";

-- CreateTable
CREATE TABLE "_NotificationToStudent" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_NotificationToStudent_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_NotificationToStudent_B_index" ON "_NotificationToStudent"("B");

-- AddForeignKey
ALTER TABLE "_NotificationToStudent" ADD CONSTRAINT "_NotificationToStudent_A_fkey" FOREIGN KEY ("A") REFERENCES "Notification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NotificationToStudent" ADD CONSTRAINT "_NotificationToStudent_B_fkey" FOREIGN KEY ("B") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;
