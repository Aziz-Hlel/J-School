import type { Gender } from '@repo/db/prisma/browser';
import type { MediaResponse } from '../media/MediaResponse';

export type TeacherSelectRes = {
  id: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  avatar: MediaResponse;
};
