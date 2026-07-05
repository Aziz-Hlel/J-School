import type { CreateFeesReq } from '@repo/contracts/schemas/Fees/create';
import type { UpdateFeesReq } from '@repo/contracts/schemas/Fees/update';
import { apiService } from '../apiService';
import { apiRoutes } from '../routes';

export const feesService = {
  create: async (params: { schoolId: string; body: CreateFeesReq }) =>
    apiService.postThrowable<void>(apiRoutes.fees.create(params.schoolId), params.body),

  update: async (params: { schoolId: string; feeId: string; body: UpdateFeesReq }) =>
    apiService.putThrowable<void>(apiRoutes.fees.update(params.schoolId, params.feeId), params.body),

  delete: async (params: { schoolId: string; feeId: string }) =>
    apiService.deleteThrowable<void>(apiRoutes.fees.delete(params.schoolId, params.feeId)),
};
