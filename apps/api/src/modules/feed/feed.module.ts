import { FeedController } from './feed.controller';
import { createRouter } from './feed.route';
import { FeedService } from './feed.service';

export const FeedModule = () => {
  const service = new FeedService();
  const controller = new FeedController(service);
  const announcementRouter = createRouter(controller);
  return {
    announcementRouter,
  };
};
