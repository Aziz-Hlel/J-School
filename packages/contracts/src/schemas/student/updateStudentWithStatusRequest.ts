import type z from 'zod';
import { createStudentRequestSchema } from './createStudentRequest';

export const updateStudentWithStatusRequestSchema = createStudentRequestSchema;

export type UpdateWithStatusStudentReq = z.infer<typeof updateStudentWithStatusRequestSchema>;
