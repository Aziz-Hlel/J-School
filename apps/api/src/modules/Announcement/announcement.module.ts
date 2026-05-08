import { AnnouncementController } from './announcement.controller';
import { createRouter } from './announcement.route';
import { AnnouncementService } from './announcement.service';

export const AnnouncementModule = () => {
  const service = new AnnouncementService();
  const controller = new AnnouncementController(service);
  const announcementRouter = createRouter(controller);
  return {
    announcementRouter,
  };
};
