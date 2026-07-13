import { useGetUserCurrentRole } from '@/store/useAuthStore';
import { UserRole } from '@repo/contracts/types/enums/enums';

export const useIsCurrentUserAdmin = () => {
  const currentRole = useGetUserCurrentRole();
  return currentRole === UserRole.DIRECTOR || currentRole === UserRole.MANAGER;
};
