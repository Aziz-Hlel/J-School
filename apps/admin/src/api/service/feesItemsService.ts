import type { CreateFeeItemsReq } from '@repo/contracts/schemas/FeeItems/create';
import type { UpdateFeeItemsReq } from '@repo/contracts/schemas/FeeItems/update';
import { apiService } from '../apiService';
import { apiRoutes } from '../routes';

export const feesItemsService = {
  create: async (schoolId: string, feeId: string, data: CreateFeeItemsReq) =>
    apiService.postThrowable(apiRoutes.fees.items.create(schoolId, feeId), data),

  update: async (schoolId: string, feeId: string, itemId: string, data: UpdateFeeItemsReq) =>
    apiService.putThrowable(apiRoutes.fees.items.update(schoolId, feeId, itemId), data),

  delete: async (schoolId: string, feeId: string, itemId: string) =>
    apiService.deleteThrowable(apiRoutes.fees.items.delete(schoolId, feeId, itemId)),

  getAll: async (schoolId: string, feeId: string) =>
    apiService.getThrowable(apiRoutes.fees.items.getAll(schoolId, feeId)),
};
