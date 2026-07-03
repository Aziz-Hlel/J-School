import { apiRoutes } from '@/api/routes';
import type { Page } from '@repo/contracts/schemas/page/Page';
import type { CreateParentRequest } from '@repo/contracts/schemas/parent/createParentRequest';
import type { ParentResponse } from '@repo/contracts/schemas/parent/parentResponse';
import type { UpdateParentRequest } from '@repo/contracts/schemas/parent/updateParentRequest';
import { apiService } from '../apiService';

export const parentService = {
  getPage: async (schoolId: string, searchParams: { [k: string]: string | number | Array<string> }) =>
    apiService.getThrowable<Page<ParentResponse>>(apiRoutes.parent.getPage(schoolId), {
      params: searchParams,
    }),

  getById: async (schoolId: string, id: string) =>
    apiService.getThrowable<ParentResponse>(apiRoutes.parent.getById(schoolId, id)),

  create: async (params: { schoolId: string; data: CreateParentRequest }) =>
    apiService.postThrowable<ParentResponse>(apiRoutes.parent.create(params.schoolId), params.data),

  update: async (params: { schoolId: string; id: string; data: UpdateParentRequest }) =>
    apiService.putThrowable<ParentResponse>(apiRoutes.parent.update(params.schoolId, params.id), params.data),

  delete: async (params: { schoolId: string; id: string }) =>
    apiService.deleteThrowable<void>(apiRoutes.parent.delete(params.schoolId, params.id)),
};
