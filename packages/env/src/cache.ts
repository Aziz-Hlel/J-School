import 'dotenv/config';
import z from 'zod';

// Redis
export const redisSchema = z.object({
  REDIS_PORT: z.coerce.number().positive(),
  REDIS_PASSWORD: z.string().trim(),
  REDIS_HOST: z.enum(['localhost', 'redis']),
});
const paredEnv = redisSchema.safeParse(process.env);

export const initCacheEnv = () => {
  if (!paredEnv.success) {
    console.error('❌ ERROR : Cache env parsing failed', paredEnv.error);
    process.exit(1);
  }

  return paredEnv.data;
};
