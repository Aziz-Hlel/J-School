import type { ApiRes } from '@/types/api/ApiResponse2';
import type { AttendanceSyncInput } from '@repo/contracts/schemas/Attendance/sync';
import type { GetClassroomAttendancesQuery } from '@repo/contracts/schemas/classroom/management/getClassroomAttendancesQuery';
import type { ClassroomAttendancesResponse } from '@repo/contracts/schemas/classroom/management/getClassroomAttendancesResponse';
import { apiService } from '../apiService';
import { apiRoutes } from '../routes';

export const attendanceService = {
  sync: async (schoolId: string, input: AttendanceSyncInput) =>
    apiService.postThrowable(apiRoutes.attendance.sync(schoolId), input),

  get: async (schoolId: string, classroomId: string, params: GetClassroomAttendancesQuery) =>
    apiService.getThrowable<ApiRes<ClassroomAttendancesResponse[]>>(apiRoutes.attendance.get(schoolId, classroomId), {
      params,
    }),
};
