import { asyncHandler } from '@/core/async-handler';
import { requireAuth } from '@/middleware/requireAuth.middleware';
import { Router } from 'express';
import { CalendarController } from './calendar.controller';

export const createRouter = (controller: CalendarController) => {
  const router = Router({ mergeParams: true });

  router.post('/', requireAuth, asyncHandler(controller.create));

  router.put('/:calendarId', requireAuth, asyncHandler(controller.update));

  router.get('/', requireAuth, asyncHandler(controller.findAll));
  router.get('/:calendarId', requireAuth, asyncHandler(controller.findById));

  router.delete('/:calendarId', requireAuth, asyncHandler(controller.delete));

  return router;
};
