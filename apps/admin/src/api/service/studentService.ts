import type { Page } from '@repo/contracts/schemas/page/Page';
import type { AssignStudentToClassroomReq } from '@repo/contracts/schemas/student/assignStudentToClassroomReq';
import { type CreateStudentReq } from '@repo/contracts/schemas/student/createStudentRequest';
import type { StudentFullDetailsResponse } from '@repo/contracts/schemas/student/studentFullDetails';
import type { StudentResponse } from '@repo/contracts/schemas/student/studentResponse';
import type { StudentWithClassroomResponse } from '@repo/contracts/schemas/student/studentWithClassroomResponse';
import type { UpdateWithStatusStudentReq } from '@repo/contracts/schemas/student/updateStudentWithStatusRequest';
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

  updateWithStatus: async (schoolId: string, id: string, data: UpdateWithStatusStudentReq) =>
    apiService.putThrowable<StudentResponse>(apiRoutes.student.updateWithStatus(schoolId, id), data),

  findFullDetails: async (schoolId: string, studentId: string) =>
    apiService.getThrowable<{ data: StudentFullDetailsResponse }>(
      apiRoutes.student.findFullDetails(schoolId, studentId),
    ),

  delete: async (schoolId: string, id: string) =>
    apiService.deleteThrowable<void>(apiRoutes.student.delete(schoolId, id)),

  assignToClassroom: async (schoolId: string, studentId: string, data: AssignStudentToClassroomReq) =>
    apiService.patchThrowable<StudentResponse>(apiRoutes.student.assignToClassroom(schoolId, studentId), data),
};
