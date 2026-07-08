import type { ApiRes } from '@/types/api/ApiResponse2';
import type { Cursor } from '@repo/contracts/schemas/cursor/cursorResponse';
import type { CreateExtraCurricularReq } from '@repo/contracts/schemas/extraCurricular/createExtraCurricularRequest';
import type { ExtraCurricularResponse } from '@repo/contracts/schemas/extraCurricular/extraCurricularResponse';
import type { PostResponse } from '@repo/contracts/schemas/extraCurricular/post/postResponse';
import type { UpdateExtraCurricularReq } from '@repo/contracts/schemas/extraCurricular/updateExtraCurricularReq';
import type { Page } from '@repo/contracts/schemas/page/Page';
import type { StudentWithClassroomResponse } from '@repo/contracts/schemas/student/studentWithClassroomResponse';
import { apiService } from '../apiService';
import { apiRoutes } from '../routes';

export const extraCurricularService = {
  create: (params: { schoolId: string; data: CreateExtraCurricularReq }) =>
    apiService.postThrowable(apiRoutes.extracurriculars.create(params.schoolId), params.data),

  update: (params: { schoolId: string; id: string; data: UpdateExtraCurricularReq }) =>
    apiService.putThrowable(apiRoutes.extracurriculars.update(params.schoolId, params.id), params.data),

  delete: (params: { schoolId: string; id: string }) =>
    apiService.deleteThrowable(apiRoutes.extracurriculars.delete(params.schoolId, params.id)),

  getPage: async (schoolId: string, searchParams: { [k: string]: string | number | Array<string> }) =>
    apiService.getThrowable<Page<ExtraCurricularResponse>>(apiRoutes.extracurriculars.getPage(schoolId), {
      params: searchParams,
    }),

  get: async (schoolId: string, id: string) =>
    apiService.getThrowable<ApiRes<ExtraCurricularResponse>>(apiRoutes.extracurriculars.get(schoolId, id)),

  getStudents: async (schoolId: string, id: string) =>
    apiService.getThrowable<ApiRes<StudentWithClassroomResponse[]>>(
      apiRoutes.extracurriculars.getStudents(schoolId, id),
    ),

  post: {
    getCursor: async (params: { schoolId: string; id: string; cursor: string | null }) =>
      apiService.getThrowable<Cursor<PostResponse>>(
        apiRoutes.extracurriculars.post.getCursor(params.schoolId, params.id),
        {
          params: { cursor: params.cursor, limit: 10 },
        },
      ),
  },
};
