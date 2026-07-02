import { asyncHandler } from '@/core/async-handler';
import { requireAuth } from '@/middleware/requireAuth.middleware';
import { Router } from 'express';
import { HomeworkChatbotController } from './homeworkChatbot.controller';

export const createRouter = (controller: HomeworkChatbotController) => {
  const router = Router({ mergeParams: true });
  router.post('/', requireAuth, asyncHandler(controller.sendMessage));
  router.get('/', requireAuth, asyncHandler(controller.findHistory));
  return router;
};
