import { apiRoutes } from '@/api/routes';
import type { Page } from '@repo/contracts/schemas/page/Page';
import type { StaffResponse } from '@repo/contracts/schemas/staff/staffResponse';
import { apiService } from '../apiService';

export const staffService = {
  getPage: async (schoolId: string, searchParams: { [k: string]: string | number | Array<string> }) =>
    apiService.getThrowable<Page<StaffResponse>>(apiRoutes.staff.getPage(schoolId), {
      params: searchParams,
    }),

  getById: async (schoolId: string, id: string) =>
    apiService.getThrowable<StaffResponse>(apiRoutes.staff.getById(schoolId, id)),

  create: async (schoolId: string, data: { name: string; email: string; phone: string }) =>
    apiService.postThrowable<StaffResponse>(apiRoutes.staff.create(schoolId), data),

  update: async (schoolId: string, id: string, data: { name: string; email: string; phone: string }) =>
    apiService.putThrowable<StaffResponse>(apiRoutes.staff.update(schoolId, id), data),

  delete: async (schoolId: string, id: string) =>
    apiService.deleteThrowable<void>(apiRoutes.staff.delete(schoolId, id)),
};
