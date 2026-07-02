-- CreateIndex
CREATE INDEX "UserNotification_userId_notificationId_isRead_idx" ON "UserNotification"("userId", "notificationId", "isRead");
