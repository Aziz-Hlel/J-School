import { MediaService } from './media.service';
import { createRouter } from './media.route';
import { MediaController } from './media.controller';
import { MediaRepo } from './media.repo';

export const createMediaModule = () => {
  const mediaRepo = new MediaRepo();
  const mediaService = new MediaService(mediaRepo);
  const controller = new MediaController(mediaService);
  const mediaRouter = createRouter(controller);
  return { mediaRouter, mediaService };
};
