import { z } from 'zod';

const ENV_schema = z
  .object({
    VITE_NODE_ENV: z.enum(['dev', 'stage', 'build', 'production']),
    VITE_ADMIN_PORT: z.coerce.number().int().positive().optional(),
    VITE_API_URL: z.string(),
    VITE_FIREBASE_API_KEY: z.string(),
    VITE_FIREBASE_AUTH_DOMAIN: z.string(),
    VITE_FIREBASE_PROJECT_ID: z.string(),
    VITE_FIREBASE_STORAGE_BUCKET: z.string(),
    VITE_FIREBASE_MESSAGING_SENDER_ID: z.string(),
    VITE_FIREBASE_APP_ID: z.string(),
    VITE_FIREBASE_MEASUREMENT_ID: z.string(),
  })
  .refine(
    (data) => {
      if (['dev', 'build'].includes(data.VITE_NODE_ENV)) {
        return data.VITE_ADMIN_PORT !== undefined;
      }
      return true;
    },
    {
      path: ['VITE_ADMIN_PORT'],
      message: 'VITE_ADMIN_PORT is required when NODE_ENV is dev or build',
    },
  );

const rawEnv = ENV_schema.parse(import.meta.env);

const BASE_URL = rawEnv.VITE_API_URL;

const ENV = {
  ...rawEnv,
  BASE_URL,
};

export default ENV;
