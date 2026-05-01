import z from 'zod';
import { API_PORT, FIREBASE_CERT, smtpSchema, dbSchema, redisSchema, mobileVersionsSchema } from './envs.fields';

const baseSchema = z.object({
  // APP
  API_PORT,

  // FIREBASE
  FIREBASE_CERT,

  // DB
  ...dbSchema,

  // REDIS
  ...redisSchema,

  // SMTP
  ...smtpSchema,

  // APP VERSIONS
  ...mobileVersionsSchema,
});

export default baseSchema;
