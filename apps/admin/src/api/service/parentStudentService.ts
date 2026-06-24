import { apiService } from '../apiService';
import { apiRoutes } from '../routes';

export const parentStudentService = {
  unassignStudentFromParent: async (params: { studentId: string; parentId: string; schoolId: string }) =>
    apiService.deleteThrowable(
      apiRoutes.parentStudent.unassignStudentFromParent(params.studentId, params.parentId, params.schoolId),
    ),

  assignStudentToParent: async (params: { studentId: string; parentId: string; schoolId: string }) =>
    apiService.postThrowable(
      apiRoutes.parentStudent.assignStudentToParent(params.studentId, params.parentId, params.schoolId),
      {},
    ),
};
