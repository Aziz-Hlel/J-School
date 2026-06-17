import type { Gender } from '@repo/contracts/types/enums/enums';
import { Mars, Venus } from 'lucide-react';

export type GenderVariant = {
  className: string;
  Icon: React.ComponentType<{ className?: string }>;
};

export const GENDER_VARIANTS: Record<Gender, GenderVariant> = {
  MALE: {
    Icon: Mars,
    className: 'bg-blue-100/40 text-blue-900 dark:text-blue-200 border-blue-300',
  },
  FEMALE: {
    Icon: Venus,
    className: 'bg-pink-100/40 text-pink-900 dark:text-pink-200 border-pink-300',
  },
};
