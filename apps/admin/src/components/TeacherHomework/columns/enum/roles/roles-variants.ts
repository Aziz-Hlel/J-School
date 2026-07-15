import type { UserRole } from '@repo/contracts/types/enums/enums';
import { GraduationCap, ShieldUser, UserStar } from 'lucide-react';

export type StatusVariant = {
  className: string;
  Icon: React.ComponentType<{ className?: string }>;
};

export const STATUS_VARIANTS: Record<UserRole, StatusVariant> = {
  DIRECTOR: {
    Icon: ShieldUser,
    className: 'bg-teal-100/40 text-teal-900 dark:text-teal-200 border-teal-300',
  },
  MANAGER: {
    Icon: UserStar,
    className: 'bg-indigo-100/40 text-indigo-900 dark:text-indigo-200 border-indigo-300',
  },
  PARENT: {
    Icon: GraduationCap,
    className: 'bg-violet-100/40 text-violet-900 dark:text-violet-200 border-violet-300',
  },
  TEACHER: {
    Icon: GraduationCap,
    className: 'bg-violet-100/40 text-violet-900 dark:text-violet-200 border-violet-300',
  },
};
