import { apiRoutes } from '@/api/routes';
import type { ApiRes } from '@/types/api/ApiResponse2';
import type { GetClassroomTimetableResponse } from '@repo/contracts/schemas/assignment/getClassroomTimetableResponse';
import type { ClassroomResponse } from '@repo/contracts/schemas/classroom/classResponse';
import type { CreateClassroomRequest as CreateClassroomReq } from '@repo/contracts/schemas/classroom/createClassRequest';
import type { ClassroomExamScheduleResponse } from '@repo/contracts/schemas/classroom/management/ClassroomExamSchedulesResponse';
import type { ClassroomExamsRes } from '@repo/contracts/schemas/classroom/management/ClassroomExamsRes';
import type { ClassroomSubjectsWithTeachersResponse } from '@repo/contracts/schemas/classroom/management/ClassroomSubjectsWithTeachers';
import type { CreateClassroomTimetableReq } from '@repo/contracts/schemas/classroom/timeTable/createTimetableRequest2';
import type { UpdateClassroomRequest as UpdateClassroomReq } from '@repo/contracts/schemas/classroom/updateClassRequest';
import type { UpdateExamScheduleRequest } from '@repo/contracts/schemas/examSchedule/updateExamScheduleRequest';
import type { Page } from '@repo/contracts/schemas/page/Page';
import type { StudentResponse } from '@repo/contracts/schemas/student/studentResponse';
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
      apiRoutes.classrooms.timetable.getWeekly(params.schoolId, params.classroomId),
    ),

  subjects: async (params: { schoolId: string; classroomId: string }) =>
    apiService.getThrowable<ApiRes<ClassroomSubjectsWithTeachersResponse[]>>(
      apiRoutes.classrooms.subjects(params.schoolId, params.classroomId),
    ),

  createTimetable: async (params: { schoolId: string; classroomId: string; data: CreateClassroomTimetableReq }) =>
    apiService.postThrowable<ApiRes<GetClassroomTimetableResponse>>(
      apiRoutes.classrooms.timetable.create(params.schoolId, params.classroomId),
      params.data,
    ),

  deleteTimetable: async (params: { schoolId: string; classroomId: string; timetableId: string }) =>
    apiService.deleteThrowable<ApiRes<GetClassroomTimetableResponse>>(
      apiRoutes.classrooms.timetable.delete(params.schoolId, params.classroomId, params.timetableId),
    ),

  getStudents: async (params: { schoolId: string; classroomId: string }) =>
    apiService.getThrowable<ApiRes<StudentResponse[]>>(
      apiRoutes.classrooms.students(params.schoolId, params.classroomId),
    ),

  exams: {
    get: async (params: { schoolId: string; classroomId: string }) =>
      apiService.getThrowable<ApiRes<ClassroomExamScheduleResponse[]>>(
        apiRoutes.classrooms.exams.get(params.schoolId, params.classroomId),
      ),

    select: async (params: { schoolId: string; classroomId: string }) =>
      apiService.getThrowable<ApiRes<ClassroomExamsRes[]>>(
        apiRoutes.classrooms.exams.select(params.schoolId, params.classroomId),
      ),

    update: async (params: {
      schoolId: string;
      classroomId: string;
      examId: string;
      data: UpdateExamScheduleRequest;
    }) =>
      apiService.putThrowable(
        apiRoutes.classrooms.exams.update(params.schoolId, params.classroomId, params.examId),
        params.data,
      ),

    delete: async (params: { schoolId: string; classroomId: string; examId: string }) =>
      apiService.deleteThrowable(apiRoutes.classrooms.exams.delete(params.schoolId, params.classroomId, params.examId)),
  },
};
