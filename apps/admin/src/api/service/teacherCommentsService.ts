import type { Page } from '@repo/contracts/schemas/page/Page';
import type { TeacherCommentsResponse } from '@repo/contracts/schemas/TeacherComments/response';
import { apiService } from '../apiService';
import { apiRoutes } from '../routes';

export const teacherCommentsService = {
  getPage: async (schoolId: string, searchParams: { [k: string]: string | number | Array<string> }) =>
    apiService.getThrowable<Page<TeacherCommentsResponse>>(apiRoutes.teacherComments.getPage(schoolId), {
      params: searchParams,
    }),

  delete: (params: { schoolId: string; teacherId: string; id: string }) =>
    apiService.deleteThrowable(apiRoutes.teacherComments.delete(params.schoolId, params.teacherId, params.id)),
};
