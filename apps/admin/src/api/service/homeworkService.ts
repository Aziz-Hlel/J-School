import type { CreateHomeworkReq } from '@repo/contracts/schemas/Homework/create';
import type { HomeworkWithTeacherAndStudents } from '@repo/contracts/schemas/Homework/responseWithTeacherAndStudents';
import type { Page } from '@repo/contracts/schemas/page/Page';
import { apiService } from '../apiService';
import { apiRoutes } from '../routes';

export const homeworkService = {
  getPage: async (schoolId: string, searchParams: { [k: string]: string | number | Array<string> }) =>
    apiService.getThrowable<Page<HomeworkWithTeacherAndStudents>>(apiRoutes.homework.getPage(schoolId), {
      params: searchParams,
    }),

  delete: async (params: { schoolId: string; homeworkId: string }) =>
    apiService.deleteThrowable(apiRoutes.homework.delete(params.schoolId, params.homeworkId)),

  create: async (params: { schoolId: string; homework: CreateHomeworkReq }) =>
    apiService.postThrowable<void>(apiRoutes.homework.create(params.schoolId), params.homework),
};
