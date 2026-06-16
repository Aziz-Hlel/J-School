import { asyncHandler } from '@/core/async-handler';
import { requireAuth } from '@/middleware/requireAuth.middleware';
import { Router } from 'express';
import { MobileController } from './mobile.controller';

export const createRouter = (controller: MobileController) => {
  const router = Router({ mergeParams: true });
  router.get('/android/version-policy', requireAuth, asyncHandler(controller.getAndroidVersion));
  router.get('/ios/version-policy', requireAuth, asyncHandler(controller.getIosVersion));
  return router;
};
