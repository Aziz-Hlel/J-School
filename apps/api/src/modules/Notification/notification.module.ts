import { NotificationController } from './notification.controller';
import { createRouter } from './notification.route';
import { NotificationService } from './notification.service';

export const NotificationModule = () => {
  const service = new NotificationService();
  const controller = new NotificationController(service);
  const notificationRouter = createRouter(controller);
  return {
    notificationRouter,
  };
};
