import { Mars, Venus, CheckCircle2, Clock, XCircle } from 'lucide-react';
import type { Gender, Status } from '@/api/api.types';

export const statusTypes = new Map<Status, { label: string; icon: React.ElementType; className: string }>([
  [
    'APPROVED',
    {
      label: 'Approved',
      icon: CheckCircle2,
      className: 'bg-teal-100/40 text-teal-900 dark:text-teal-200 border-teal-300',
    },
  ],
  [
    'PENDING',
    {
      label: 'Pending',
      icon: Clock,
      className: 'bg-amber-100/40 text-amber-900 dark:text-amber-200 border-amber-300',
    },
  ],
  [
    'REJECTED',
    {
      label: 'Rejected',
      icon: XCircle,
      className: 'bg-rose-100/40 text-rose-900 dark:text-rose-200 border-rose-300',
    },
  ],
]);

export const genderTypes = new Map<Gender, { label: string; icon: React.ElementType; className: string }>([
  [
    'M',
    {
      label: 'Male',
      icon: Mars,
      className: 'bg-blue-100/40 text-blue-900 dark:text-blue-200 border-blue-300',
    },
  ],
  [
    'F',
    {
      label: 'Female',
      icon: Venus,
      className: 'bg-rose-100/40 text-rose-900 dark:text-rose-200 border-rose-300',
    },
  ],
]);
