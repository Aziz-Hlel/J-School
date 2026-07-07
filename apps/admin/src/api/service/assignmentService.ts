import type { AssignTeacherRequestInput } from '@repo/contracts/schemas/assignment/assignTeacherRequest';
import { apiService } from '../apiService';
import { apiRoutes } from '../routes';

export const assignmentService = {
  assignTeacher: async (schoolId: string, assignmentId: string, input: AssignTeacherRequestInput) =>
    apiService.patchThrowable(apiRoutes.assignments.assignTeacher(schoolId, assignmentId), input),
};
