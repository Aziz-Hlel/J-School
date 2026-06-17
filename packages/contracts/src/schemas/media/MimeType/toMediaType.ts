import { MediaType } from '@repo/db/prisma/enums';
import type { IMimeType } from './mimeTypes';

export const mimeTypeToMediaType: Record<IMimeType, MediaType> = {
  ['image/jpeg']: MediaType.IMAGE,
  ['image/png']: MediaType.IMAGE,
  ['image/heic']: MediaType.IMAGE,
  ['image/gif']: MediaType.IMAGE,
  ['image/webp']: MediaType.IMAGE,
  ['video/mp4']: MediaType.VIDEO,
  ['video/quicktime']: MediaType.VIDEO,
  ['application/pdf']: MediaType.DOCUMENT,
};
