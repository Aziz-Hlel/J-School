import baseSchema from './schema.base';
import { prodEnvs } from './NodeEnvs';
import { awsStorageSchema, cdnSchema, corsSchema } from './envs.fields';
import z from 'zod';

const prodSchema = baseSchema.extend({
  NODE_ENV: z.enum(prodEnvs),

  // STORAGE
  ...awsStorageSchema,

  // CDN
  ...cdnSchema,

  // CORS
  ...corsSchema,
});

export default prodSchema;
export type ProdEnv = z.infer<typeof prodSchema>;
