import { apiRoutes } from '@/api/routes';
import type { ClassroomResponse } from '@repo/contracts/schemas/classroom/classResponse';
import type { Page } from '@repo/contracts/schemas/page/Page';
import { apiService } from '../apiService';

export const classroomsService = {
  getPage: async (schoolId: string, searchParams: { [k: string]: string | number | Array<string> }) =>
    apiService.getThrowable<Page<ClassroomResponse>>(apiRoutes.classrooms.getPage(schoolId), {
      params: searchParams,
    }),

  getById: async (schoolId: string, id: string) =>
    apiService.getThrowable<ClassroomResponse>(apiRoutes.classrooms.getById(schoolId, id)),

  create: async (schoolId: string, data: { name: string; email: string; phone: string }) =>
    apiService.postThrowable<ClassroomResponse>(apiRoutes.classrooms.create(schoolId), data),

  update: async (schoolId: string, id: string, data: { name: string; email: string; phone: string }) =>
    apiService.putThrowable<ClassroomResponse>(apiRoutes.classrooms.update(schoolId, id), data),

  delete: async (schoolId: string, id: string) =>
    apiService.deleteThrowable<void>(apiRoutes.classrooms.delete(schoolId, id)),
};
