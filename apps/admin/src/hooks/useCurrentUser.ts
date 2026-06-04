import { authService } from '@/api/service/authService';
import { useAuthStore } from '@/store/useAuthStore';
import type { UserProfileResponse } from '@repo/contracts/schemas/profile/UserProfileResponse';
import { useQuery } from '@tanstack/react-query';

export const CURRENT_USER_QUERY_KEY = ['auth', 'user'] as const;

export function useCurrentUser() {
  const status = useAuthStore((s) => s.status);

  return useQuery<UserProfileResponse>({
    queryKey: CURRENT_USER_QUERY_KEY,
    enabled: status === 'authenticated',
    retry: false,
    queryFn: async () => {
      const response = await authService.me();

      if (!response.success) {
        throw new Error('Failed to fetch user');
      }

      return response.data.data;
    },
  });
}
