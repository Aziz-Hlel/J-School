import type { Page } from '@repo/contracts/types/page/Page';
import { apiService } from '../apiService';
import apiRoutes from '../routes/routes';
import type { UserProfileRowResponse } from '@repo/contracts/schemas/user/UserRowResponse';
import type { CreateUserProfileRequest } from '@repo/contracts/schemas/profile/createUserProfileRequest';
import type { UserProfileResponse } from '@repo/contracts/schemas/profile/UserProfileResponse';
import type { UpdateUserProfileRequest } from '@repo/contracts/schemas/profile/updateUserProfileRequest';

const userService = {
  getUsers: async (searchParams: { [k: string]: string | number | Array<string> }) =>
    apiService.getThrowable<Page<UserProfileRowResponse>>(apiRoutes.users.getUsers(), {
      params: searchParams,
    }),

  createUserProfile: async (payload: CreateUserProfileRequest) => {
    return apiService.postThrowable<UserProfileResponse>(apiRoutes.users.createUserProfile(), payload);
  },

  updateUserProfile: async ({ id, payload }: { id: string; payload: UpdateUserProfileRequest }) => {
    return apiService.putThrowable<UserProfileResponse>(apiRoutes.users.updateUserProfile(id), payload);
  },

  deleteUserProfile: async (id: string) => {
    return apiService.deleteThrowable<void>(apiRoutes.users.deleteUserProfile(id));
  },

  disableUser: async (id: string) => {
    return apiService.postThrowable<void>(apiRoutes.users.disableUser(id), {});
  },

  enableUser: async (id: string) => {
    return apiService.postThrowable<void>(apiRoutes.users.enableUser(id), {});
  },
};

export default userService;
