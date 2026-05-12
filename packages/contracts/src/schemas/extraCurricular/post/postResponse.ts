import type { MediaResponse } from '@repo/contracts/schemas/media/MediaResponse';

export type PostResponse = {
  id: string;
  content: string | null;
  media: MediaResponse[];
  createdAt: string;
  updatedAt: string;
};
