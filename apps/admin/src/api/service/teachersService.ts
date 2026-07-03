import type { Page } from '@repo/contracts/schemas/page/Page';
import type { CreateTeacherRequest } from '@repo/contracts/schemas/teacher/createTeacherRequest';
import type { TeacherResponse } from '@repo/contracts/schemas/teacher/teacherResponse';
import type { UpdateTeacherRequest } from '@repo/contracts/schemas/teacher/updateTeacherRequest';
import { apiService } from '../apiService';
import { apiRoutes } from '../routes';

export const teacherService = {
  create: async (params: { schoolId: string; data: CreateTeacherRequest }) =>
    apiService.postThrowable<TeacherResponse>(apiRoutes.teacher.create(params.schoolId), params.data),

  update: async (params: { schoolId: string; id: string; payload: UpdateTeacherRequest }) =>
    apiService.putThrowable<TeacherResponse>(apiRoutes.teacher.update(params.schoolId, params.id), params.payload),

  getPage: async (schoolId: string, searchParams: { [k: string]: string | number | Array<string> }) =>
    apiService.getThrowable<Page<TeacherResponse>>(apiRoutes.teacher.getPage(schoolId), {
      params: searchParams,
    }),

  getById: async (schoolId: string, id: string) =>
    apiService.getThrowable<TeacherResponse>(apiRoutes.teacher.getById(schoolId, id)),

  delete: async (params: { schoolId: string; id: string }) =>
    apiService.deleteThrowable(apiRoutes.teacher.delete(params.schoolId, params.id)),
};
