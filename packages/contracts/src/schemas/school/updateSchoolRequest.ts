import type z from 'zod';
import { CreateSchoolRequestSchema } from './createSchoolRequest';

export const updateSchoolRequestSchema = CreateSchoolRequestSchema;

export type UpdateSchoolRequest = z.infer<typeof updateSchoolRequestSchema>;
