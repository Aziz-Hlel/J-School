import type { Page } from '@repo/contracts/schemas/page/Page';
import { type CreateStudentReq } from '@repo/contracts/schemas/student/createStudentRequest';
import type { StudentResponse } from '@repo/contracts/schemas/student/studentResponse';
import type { StudentWithClassroomResponse } from '@repo/contracts/schemas/student/studentWithClassroomResponse';
import { type UpdateStudentReq } from '@repo/contracts/schemas/student/updateStudentRequest';
import { apiService } from '../apiService';
import { apiRoutes } from '../routes';

export const studentService = {
  getPage: async (schoolId: string, searchParams: { [k: string]: string | number | Array<string> }) =>
    apiService.getThrowable<Page<StudentWithClassroomResponse>>(apiRoutes.student.getPage(schoolId), {
      params: searchParams,
    }),

  create: async (schoolId: string, data: CreateStudentReq) =>
    apiService.postThrowable<StudentResponse>(apiRoutes.student.create(schoolId), data),

  getById: async (schoolId: string, studentId: string) =>
    apiService.getThrowable<StudentResponse>(apiRoutes.student.getById(schoolId, studentId)),

  update: async (schoolId: string, id: string, data: UpdateStudentReq) =>
    apiService.putThrowable<StudentResponse>(apiRoutes.student.update(schoolId, id), data),

  delete: async (schoolId: string, id: string) =>
    apiService.deleteThrowable<void>(apiRoutes.student.delete(schoolId, id)),
};
