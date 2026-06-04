import { useAuthStore } from '@/store/useAuthStore';
import type { UserProfileResponse } from '@repo/contracts/schemas/profile/UserProfileResponse';
import { createContext, useContext } from 'react';
import { Outlet } from 'react-router';

const UserSessionContext = createContext<UserProfileResponse | undefined>(undefined);
export function UserSessionProvider() {
  const currentUser = useAuthStore((state) => state.currentUser);

  if (!currentUser) return <> User still not defined when passed through UserProvider Context </>;

  return (
    <UserSessionContext.Provider value={currentUser}>
      <Outlet />
    </UserSessionContext.Provider>
  );
}

export const useUser = (): UserProfileResponse => {
  const user = useContext(UserSessionContext);

  if (user === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }

  return user;
};
