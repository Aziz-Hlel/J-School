import { asyncHandler } from '@/core/async-handler';
import { Router } from 'express';
import { MobileController } from './mobile.controller';

export const createRouter = (controller: MobileController) => {
  const router = Router({ mergeParams: true });
  router.get('/android/version-policy', asyncHandler(controller.getAndroidVersion));
  router.get('/ios/version-policy', asyncHandler(controller.getIosVersion));
  return router;
};
