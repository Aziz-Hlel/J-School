import { Router } from 'express';
import { HomeworkChatbotController } from './homeworkChatbot.controller';
import { asyncHandler } from '@/core/async-handler';
import { requireAuth } from '@/middleware/requireAuth.middleware';

export const createRouter = (controller: HomeworkChatbotController) => {
  const router = Router({ mergeParams: true });
  router.post('/', requireAuth, asyncHandler(controller.create));
  router.put('/:homeworkChatbotId', requireAuth, asyncHandler(controller.update));
  router.delete('/:homeworkChatbotId', requireAuth, asyncHandler(controller.delete));
  router.get('/:homeworkChatbotId', requireAuth, asyncHandler(controller.findById));
  return router;
};
