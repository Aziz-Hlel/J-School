import type { ApiRes } from '@/types/api/ApiResponse2';
import type { UpdateUserRolesReq } from '@repo/contracts/schemas/user/updateUserRolesReq';
import type { UserRoleResponse } from '@repo/contracts/schemas/user/UserRolesResponse';
import { apiService } from '../apiService';
import { apiRoutes } from '../routes';

const userService = {
  getUserRoles: async ({ userId, schoolId }: { userId: string; schoolId: string }) =>
    apiService.getThrowable<ApiRes<UserRoleResponse[]>>(apiRoutes.user.getUserRoles(schoolId, userId)),

  updateUserRoles: async ({ userId, data, schoolId }: { userId: string; data: UpdateUserRolesReq; schoolId: string }) =>
    apiService.putThrowable<ApiRes<UserRoleResponse[]>>(apiRoutes.user.updateUserRoles(schoolId, userId), data),

  deleteUser: async ({ userId, schoolId }: { userId: string; schoolId: string }) =>
    apiService.deleteThrowable<ApiRes<void>>(apiRoutes.user.deleteUser(schoolId, userId)),
};

export default userService;
