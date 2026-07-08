import type { CreateExamScheduleRequest } from '@repo/contracts/schemas/examSchedule/createExamScheduleRequest';
import type { UpdateExamScheduleRequest } from '@repo/contracts/schemas/examSchedule/updateExamScheduleRequest';
import { apiService } from '../apiService';
import { apiRoutes } from '../routes';

export const examSchedulesService = {
  create: (params: { schoolId: string; data: CreateExamScheduleRequest }) =>
    apiService.postThrowable(apiRoutes.examSchedules.create(params.schoolId), params.data),

  update: (params: { schoolId: string; examScheduleId: string; data: UpdateExamScheduleRequest }) =>
    apiService.putThrowable(apiRoutes.examSchedules.update(params.schoolId, params.examScheduleId), params.data),

  delete: (params: { schoolId: string; examScheduleId: string }) =>
    apiService.deleteThrowable(apiRoutes.examSchedules.delete(params.schoolId, params.examScheduleId)),
};
