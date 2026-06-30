import { z } from 'zod';
import { awsBedrockSchema, awsStorageSchema } from './server/envs.fields';

export const ocrEnvSchema = z.object({ ...awsBedrockSchema, ...awsStorageSchema });

const validatedEnv = ocrEnvSchema.safeParse(process.env);
if (!validatedEnv.success) {
  console.error('❌ ERROR : Zod validation failed');
  const formattedZodError = z.treeifyError(validatedEnv.error);
  throw new Error(JSON.stringify(formattedZodError, null, 2));
}

export const ocrEnv = validatedEnv.data;

export type OcrEnv = z.infer<typeof ocrEnv>;
