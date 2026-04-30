import z from 'zod';
import { dbSchema } from './server/envs.fields';
import 'dotenv/config';

const schema = z.object(dbSchema);

export const DB_ENV = schema.parse(process.env);
