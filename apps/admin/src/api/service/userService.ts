import type { ApiRes } from '@/types/api/ApiResponse2';
import type { UpdateUserRolesReq } from '@repo/contracts/schemas/user/updateUserRolesReq';
import type { UserRoleResponse } from '@repo/contracts/schemas/user/UserRolesResponse';
import { apiService } from '../apiService';
import { apiRoutes } from '../routes';

const userService = {
  getUserRoles: async ({ userId }: { userId: string }) =>
    apiService.getThrowable<ApiRes<UserRoleResponse[]>>(apiRoutes.user.getUserRoles(userId)),

  updateUserRoles: async ({ userId, data }: { userId: string; data: UpdateUserRolesReq }) =>
    apiService.putThrowable<ApiRes<UserRoleResponse[]>>(apiRoutes.user.updateUserRoles(userId), data),
};

export default userService;
