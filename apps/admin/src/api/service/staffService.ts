import { apiRoutes } from '@/api/routes';
import type { Page } from '@repo/contracts/schemas/page/Page';
import type { CreateStaffRequest } from '@repo/contracts/schemas/staff/createStaffRequest';
import type { StaffResponse } from '@repo/contracts/schemas/staff/staffResponse';
import type { UpdateSimpleUserRequest } from '@repo/contracts/schemas/user/updateSimpleUserRequest';
import { apiService } from '../apiService';

export const staffService = {
  getPage: async (schoolId: string, searchParams: { [k: string]: string | number | Array<string> }) =>
    apiService.getThrowable<Page<StaffResponse>>(apiRoutes.staff.getPage(schoolId), {
      params: searchParams,
    }),

  getById: async (schoolId: string, id: string) =>
    apiService.getThrowable<StaffResponse>(apiRoutes.staff.getById(schoolId, id)),

  create: async (schoolId: string, data: CreateStaffRequest) =>
    apiService.postThrowable<StaffResponse>(apiRoutes.staff.create(schoolId), data),

  update: async (schoolId: string, id: string, data: UpdateSimpleUserRequest) =>
    apiService.putThrowable<StaffResponse>(apiRoutes.staff.update(schoolId, id), data),

  delete: async (schoolId: string, id: string) =>
    apiService.deleteThrowable<void>(apiRoutes.staff.delete(schoolId, id)),
};
