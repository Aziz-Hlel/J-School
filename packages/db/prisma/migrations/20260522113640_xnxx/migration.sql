/*
  Warnings:

  - You are about to drop the column `notificationId` on the `NotificationTranslation` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "NotificationTranslation" DROP CONSTRAINT "NotificationTranslation_notificationId_fkey";

-- DropIndex
DROP INDEX "NotificationTranslation_notificationId_language_key";

-- AlterTable
ALTER TABLE "NotificationTranslation" DROP COLUMN "notificationId";
