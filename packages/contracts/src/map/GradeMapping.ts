import type { ClassGrade } from '@repo/db/prisma/enums';

export const GradeMapping: Record<ClassGrade, string> = {
  KG: 'KG',
  ONE: '1',
  TWO: '2',
  THREE: '3',
  FOUR: '4',
  FIVE: '5',
  SIX: '6',
};
