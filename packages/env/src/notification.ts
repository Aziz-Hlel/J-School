import z from 'zod';
import { oneSignalSchema, redisSchema } from './server/envs.fields';
import 'dotenv/config';

const notificationEnvSchema = z.object({
  ...redisSchema,
  ...oneSignalSchema,
});

const validatedEnv = notificationEnvSchema.safeParse(process.env);
if (!validatedEnv.success) {
  console.error('❌ ERROR : Zod validation failed');
  const formattedZodError = z.treeifyError(validatedEnv.error);
  throw new Error(JSON.stringify(formattedZodError, null, 2));
}

export const notificationEnv = validatedEnv.data;
