import 'dotenv/config';
import z from 'zod';
import devSchema from './schema.dev';
import prodSchema from './schema.prod';

const envSchema = z.discriminatedUnion('NODE_ENV', [prodSchema, devSchema]);

const validatedEnv = envSchema.safeParse(process.env);
if (!validatedEnv.success) {
  console.error('❌ ERROR : Zod validation failed');
  const formattedZodError = z.treeifyError(validatedEnv.error);
  throw new Error(JSON.stringify(formattedZodError, null, 2));
}

const ENV = validatedEnv.data;

console.log('✅ SUCCESS : ENV is valid');

export type Env = z.infer<typeof envSchema>;
export type ProdEnv = z.infer<typeof prodSchema>;
export type DevEnv = z.infer<typeof devSchema>;
export type EnvAll = Omit<DevEnv, 'NODE_ENV'> &
  Omit<ProdEnv, 'NODE_ENV'> & { NODE_ENV: DevEnv['NODE_ENV'] | ProdEnv['NODE_ENV'] };
export const serverENV = ENV;
