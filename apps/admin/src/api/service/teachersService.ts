import type { ApiRes } from '@/types/api/ApiResponse2';
import type { ExamScheduleWithClassroomRes } from '@repo/contracts/schemas/examSchedule/examScheduleWithClassroomResponse';
import type { Page } from '@repo/contracts/schemas/page/Page';
import type { CreateTeacherRequest } from '@repo/contracts/schemas/teacher/createTeacherRequest';
import type { TeacherAssignmentRes } from '@repo/contracts/schemas/teacher/teacherAssignmentRes';
import type { TeacherExtraCurricularResponse } from '@repo/contracts/schemas/teacher/teacherExtraCurricularResponse';
import type { TeacherFullTimetableRes } from '@repo/contracts/schemas/teacher/teacherFullTimeTableRes';
import type { TeacherResponse } from '@repo/contracts/schemas/teacher/teacherResponse';
import type { UpdateTeacherRequest } from '@repo/contracts/schemas/teacher/updateTeacherRequest';
import type { CreateTeacherCommentsReq } from '@repo/contracts/schemas/TeacherComments/create';
import type { UpdateTeacherCommentsReq } from '@repo/contracts/schemas/TeacherComments/update';
import { apiService } from '../apiService';

import type { ClassroomResponse } from '@repo/contracts/schemas/classroom/classResponse';
import type { HomeworkWithStudentsRes } from '@repo/contracts/schemas/Homework/withStudentsRes';
import type { TeacherCommentsResponse } from '@repo/contracts/schemas/TeacherComments/response';
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

  getTimetable: async (schoolId: string, id: string) =>
    apiService.getThrowable<ApiRes<TeacherFullTimetableRes>>(apiRoutes.teacher.getTimetable(schoolId, id)),

  getExams: async (schoolId: string, id: string) =>
    apiService.getThrowable<ApiRes<ExamScheduleWithClassroomRes[]>>(apiRoutes.teacher.getExams(schoolId, id)),

  assignments: async (schoolId: string, id: string) =>
    apiService.getThrowable<ApiRes<TeacherAssignmentRes[]>>(apiRoutes.teacher.assignments(schoolId, id)),

  getExtraCurricular: async (schoolId: string, id: string) =>
    apiService.getThrowable<ApiRes<TeacherExtraCurricularResponse[]>>(
      apiRoutes.teacher.getExtraCurricular(schoolId, id),
    ),

  getComments: async (schoolId: string, id: string, searchParams: { [k: string]: string | number | Array<string> }) =>
    apiService.getThrowable<Page<TeacherCommentsResponse>>(apiRoutes.teacher.getComments(schoolId, id), {
      params: searchParams,
    }),

  classrooms: async (schoolId: string, id: string) =>
    apiService.getThrowable<ApiRes<ClassroomResponse[]>>(apiRoutes.teacher.getClassrooms(schoolId, id)),

  updateComment: async (params: {
    schoolId: string;
    teacherId: string;
    commentId: string;
    payload: UpdateTeacherCommentsReq;
  }) =>
    apiService.putThrowable<void>(
      apiRoutes.teacher.updateComment(params.schoolId, params.teacherId, params.commentId),
      params.payload,
    ),

  createComment: async (params: { schoolId: string; teacherId: string; payload: CreateTeacherCommentsReq }) =>
    apiService.postThrowable<void>(apiRoutes.teacher.createComment(params.schoolId, params.teacherId), params.payload),

  getHomework: async (schoolId: string, id: string, searchParams: { [k: string]: string | number | Array<string> }) =>
    apiService.getThrowable<Page<HomeworkWithStudentsRes>>(apiRoutes.teacher.getHomework(schoolId, id), {
      params: searchParams,
    }),
};
