import type { Gender } from '@repo/db/prisma/enums';
import type { MediaResponse } from '../media/MediaResponse';

export type TeacherCommentsResponse = {
  id: string;
  title: string;
  content: string;
  canParentReply: boolean;
  parentReply: string | null;

  student: {
    id: string;
    firstName: { en: string | null; ar: string | null };
    lastName: { en: string | null; ar: string | null };
    gender: Gender;
    avatar: MediaResponse | null;
  };
  teacher: {
    id: string;
    firstName: string;
    lastName: string;
    avatar: MediaResponse | null;
  };

  createdAt: string;
  updatedAt: string;
};
