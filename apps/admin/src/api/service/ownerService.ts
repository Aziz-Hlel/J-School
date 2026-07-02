import type { CreateOwnerRequest } from '@repo/contracts/schemas/owner/createOwnerRequest';
import { apiService } from '../apiService';
import { apiRoutes } from '../routes';

export const ownerService = {
  create: async (params: { data: CreateOwnerRequest }) =>
    apiService.postThrowable(apiRoutes.owner.create(), params.data),
};
