import { apiRoutes } from '@/api/routes';
import type { Page } from '@repo/contracts/schemas/page/Page';
import type { CreateStaffRequest } from '@repo/contracts/schemas/staff/createStaffRequest';
import type { StaffResponse } from '@repo/contracts/schemas/staff/staffResponse';
import type { UpdateStaffRequest } from '@repo/contracts/schemas/staff/updateStaffRequest';
import { apiService } from '../apiService';

export const staffService = {
  getPage: async (schoolId: string, searchParams: { [k: string]: string | number | Array<string> }) =>
    apiService.getThrowable<Page<StaffResponse>>(apiRoutes.staff.getPage(schoolId), {
      params: searchParams,
    }),

  getById: async (schoolId: string, id: string) =>
    apiService.getThrowable<StaffResponse>(apiRoutes.staff.getById(schoolId, id)),

  create: async (params: { schoolId: string; data: CreateStaffRequest }) =>
    apiService.postThrowable<StaffResponse>(apiRoutes.staff.create(params.schoolId), params.data),

  update: async (params: { schoolId: string; id: string; data: UpdateStaffRequest }) =>
    apiService.putThrowable<StaffResponse>(apiRoutes.staff.update(params.schoolId, params.id), params.data),

  delete: async (params: { schoolId: string; id: string }) =>
    apiService.deleteThrowable<void>(apiRoutes.staff.delete(params.schoolId, params.id)),
};
