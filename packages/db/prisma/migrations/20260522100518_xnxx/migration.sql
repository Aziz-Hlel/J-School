/*
  Warnings:

  - The values [MANUAL,SYSTEM] on the enum `NotificationType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `createdById` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `delaySeconds` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `scheduledAt` on the `Notification` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[notificationTitleId]` on the table `names` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[notificationContentId]` on the table `names` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `schoolId` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "NotificationType_new" AS ENUM ('GLOBAL', 'GROUP', 'PRIVATE');
ALTER TABLE "Notification" ALTER COLUMN "type" TYPE "NotificationType_new" USING ("type"::text::"NotificationType_new");
ALTER TYPE "NotificationType" RENAME TO "NotificationType_old";
ALTER TYPE "NotificationType_new" RENAME TO "NotificationType";
DROP TYPE "public"."NotificationType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_createdById_fkey";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "createdById",
DROP COLUMN "delaySeconds",
DROP COLUMN "description",
DROP COLUMN "scheduledAt",
ADD COLUMN     "schoolId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "names" ADD COLUMN     "notificationContentId" UUID,
ADD COLUMN     "notificationTitleId" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "names_notificationTitleId_key" ON "names"("notificationTitleId");

-- CreateIndex
CREATE UNIQUE INDEX "names_notificationContentId_key" ON "names"("notificationContentId");

-- AddForeignKey
ALTER TABLE "names" ADD CONSTRAINT "names_notificationTitleId_fkey" FOREIGN KEY ("notificationTitleId") REFERENCES "Notification"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "names" ADD CONSTRAINT "names_notificationContentId_fkey" FOREIGN KEY ("notificationContentId") REFERENCES "Notification"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;
