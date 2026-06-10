export const mediaState = {
  UPLOAD_FILE: 'upload-file',
  CROP: 'crop',
  UPLOADING_MEDIA: 'uploading-media',
  READY: 'ready',
  ERROR: 'error',
} as const;

export type MediaState = (typeof mediaState)[keyof typeof mediaState];
