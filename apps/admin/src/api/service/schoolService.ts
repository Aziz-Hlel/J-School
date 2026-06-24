import type { ApiRes } from '@/types/api/ApiResponse2';
import type { SelectClassroomsRes } from '@repo/contracts/schemas/classroom/SelectClassroomsRes';
import type { Cursor } from '@repo/contracts/schemas/cursor/cursorResponse';
import type { SelectParentsRes } from '@repo/contracts/schemas/school/selectParentsResponse';
import { apiService } from '../apiService';
import { apiRoutes } from '../routes';

const schoolService = {
  selectClassrooms: async ({ schoolId }: { schoolId: string }) =>
    await apiService.getThrowable<ApiRes<SelectClassroomsRes[]>>(`/schools/${schoolId}/classrooms/select`),

  selectParents: async (params: { schoolId: string; cursor: string | null }) =>
    await apiService.getThrowable<Cursor<SelectParentsRes>>(apiRoutes.schools.selectParent(params.schoolId), {
      params: { cursor: params.cursor, limit: 10 },
    }),
};

export default schoolService;
