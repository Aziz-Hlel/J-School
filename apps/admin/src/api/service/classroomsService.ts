import { apiRoutes } from '@/api/routes';
import type { ApiRes } from '@/types/api/ApiResponse2';
import type { GetClassroomTimetableResponse } from '@repo/contracts/schemas/assignment/getClassroomTimetableResponse';
import type { ClassroomResponse } from '@repo/contracts/schemas/classroom/classResponse';
import type { CreateClassroomRequest as CreateClassroomReq } from '@repo/contracts/schemas/classroom/createClassRequest';
import type { UpdateClassroomRequest as UpdateClassroomReq } from '@repo/contracts/schemas/classroom/updateClassRequest';
import type { Page } from '@repo/contracts/schemas/page/Page';
import { apiService } from '../apiService';

export const classroomsService = {
  getPage: async (schoolId: string, searchParams: { [k: string]: string | number | Array<string> }) =>
    apiService.getThrowable<Page<ClassroomResponse>>(apiRoutes.classrooms.getPage(schoolId), {
      params: searchParams,
    }),

  getById: async (schoolId: string, id: string) =>
    apiService.getThrowable<ClassroomResponse>(apiRoutes.classrooms.getById(schoolId, id)),

  create: async (params: { schoolId: string; data: CreateClassroomReq }) =>
    apiService.postThrowable<ClassroomResponse>(apiRoutes.classrooms.create(params.schoolId), params.data),

  update: async (params: { schoolId: string; id: string; data: UpdateClassroomReq }) =>
    apiService.putThrowable<ClassroomResponse>(apiRoutes.classrooms.update(params.schoolId, params.id), params.data),

  delete: async (params: { schoolId: string; id: string }) =>
    apiService.deleteThrowable<void>(apiRoutes.classrooms.delete(params.schoolId, params.id)),

  getClassroomTimetable: async (params: { schoolId: string; classroomId: string }) =>
    apiService.getThrowable<ApiRes<GetClassroomTimetableResponse>>(
      apiRoutes.classrooms.timetable.get(params.schoolId, params.classroomId),
    ),
};
