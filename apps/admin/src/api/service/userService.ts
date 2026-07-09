import type { ApiRes } from '@/types/api/ApiResponse2';
import type { UserRoleResponse } from '@repo/contracts/schemas/user/UserRolesResponse';
import { apiService } from '../apiService';
import { apiRoutes } from '../routes';

const userService = {
  getUserRoles: async ({ userId }: { userId: string }) =>
    apiService.getThrowable<ApiRes<UserRoleResponse[]>>(apiRoutes.user.getUserRoles(userId)),
};

export default userService;
