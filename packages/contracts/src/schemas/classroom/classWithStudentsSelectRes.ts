import type { ClassGrade } from '@repo/db/prisma/browser';
import type { MediaResponse } from '../media/MediaResponse';

export type ClassWithStudentsSelectRes = {
  id: string;
  name: string;
  grade: ClassGrade;
  students: {
    id: string;
    firstName: {
      en: string | null;
      ar: string | null;
    };
    lastName: {
      en: string | null;
      ar: string | null;
    };
    avatar: MediaResponse | null;
  }[];
};
