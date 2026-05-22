import 'dotenv/config';
import z from 'zod';
import { redisSchema } from './server/envs.fields';

export const cacheEnvSchema = z.object(redisSchema);
const paredEnv = cacheEnvSchema.safeParse(process.env);

export const initCacheEnv = () => {
  if (!paredEnv.success) {
    console.error('❌ ERROR : Cache env parsing failed', paredEnv.error);
    process.exit(1);
  }

  return paredEnv.data;
};
