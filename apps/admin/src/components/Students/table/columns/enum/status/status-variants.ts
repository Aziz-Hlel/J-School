import type { StudentStatus } from '@repo/contracts/types/enums/enums';
import { ShieldUser, User, UserStar } from 'lucide-react';

export type StatusVariant = {
  className: string;
  Icon: React.ComponentType<{ className?: string }>;
};

export const STATUS_VARIANTS: Record<StudentStatus, StatusVariant> = {
  ACTIVE: {
    Icon: ShieldUser,
    className: 'bg-teal-100/40 text-teal-900 dark:text-teal-200 border-teal-300',
  },
  INACTIVE: {
    Icon: UserStar,
    className: 'bg-indigo-100/40 text-indigo-900 dark:text-indigo-200 border-indigo-300',
  },
  PENDING: {
    Icon: User,
    className: 'bg-amber-100/40 text-amber-900 dark:text-amber-200 border-amber-300',
  },
  EXPELLED: {
    Icon: User,
    className: 'bg-fuchsia-100/40 text-fuchsia-900 dark:text-fuchsia-200 border-fuchsia-300',
  },
};
