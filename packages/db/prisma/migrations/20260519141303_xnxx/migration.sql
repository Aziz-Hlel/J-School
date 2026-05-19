/*
  Warnings:

  - You are about to drop the column `recipientType` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the `NotificationDelivery` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `NotificationTargetUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `NotificationTargeting` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `type` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('MANUAL', 'SYSTEM');

-- CreateEnum
CREATE TYPE "NotificationContentType" AS ENUM ('TEACHER_COMMENT', 'FEED');

-- AlterEnum
ALTER TYPE "NotificationScheduleType" ADD VALUE 'IMMEDIATE';

-- DropForeignKey
ALTER TABLE "NotificationDelivery" DROP CONSTRAINT "NotificationDelivery_notificationId_fkey";

-- DropForeignKey
ALTER TABLE "NotificationTargetUser" DROP CONSTRAINT "NotificationTargetUser_targetingId_fkey";

-- DropForeignKey
ALTER TABLE "NotificationTargetUser" DROP CONSTRAINT "NotificationTargetUser_userId_fkey";

-- DropForeignKey
ALTER TABLE "NotificationTargeting" DROP CONSTRAINT "NotificationTargeting_notificationId_fkey";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "recipientType",
ADD COLUMN     "sourceId" TEXT,
ADD COLUMN     "type" "NotificationType" NOT NULL;

-- DropTable
DROP TABLE "NotificationDelivery";

-- DropTable
DROP TABLE "NotificationTargetUser";

-- DropTable
DROP TABLE "NotificationTargeting";

-- DropEnum
DROP TYPE "DeliveryStatus";

-- DropEnum
DROP TYPE "NotificationRecipientType";

-- CreateTable
CREATE TABLE "UserNotification" (
    "id" UUID NOT NULL,
    "notificationId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserNotification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserNotification_userId_notificationId_key" ON "UserNotification"("userId", "notificationId");

-- AddForeignKey
ALTER TABLE "UserNotification" ADD CONSTRAINT "UserNotification_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "Notification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserNotification" ADD CONSTRAINT "UserNotification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
