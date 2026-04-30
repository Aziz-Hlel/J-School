import z from 'zod';
import baseSchema from './schema.base';
import { NODE_ENVS } from './NodeEnvs';
import { minioSchema } from './envs.fields';

const devSchema = baseSchema.extend({
  NODE_ENV: z.enum([NODE_ENVS.dev, NODE_ENVS.build]),

  // STORAGE
  ...minioSchema,

  // CORS
  // // ? kept it here just so i don't forget what i did
  // ...corsSchema,
});

export default devSchema;
