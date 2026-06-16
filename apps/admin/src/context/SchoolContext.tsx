import { useAuthStore } from '@/store/useAuthStore';
import { createContext, useContext } from 'react';
import { Outlet } from 'react-router';

const SchoolContext = createContext<string | undefined>(undefined);

export function SchoolIdProvider() {
  const schoolId = useAuthStore((state) => state.schoolId);

  if (!schoolId) return <> User still not defined when passed through UserProvider Context </>;

  return (
    <SchoolContext.Provider value={schoolId}>
      <Outlet />
    </SchoolContext.Provider>
  );
}

export const useCurrentSchoolId = (): string => {
  const schoolId = useContext(SchoolContext);

  if (schoolId === undefined) {
    throw new Error('useSchoolId must be used within a SchoolProvider');
  }

  return schoolId;
};
