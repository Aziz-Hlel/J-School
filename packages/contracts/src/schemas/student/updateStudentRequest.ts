import type z from 'zod';
import { createStudentRequestSchema } from './createStudentRequest';

export const updateStudentRequestSchema = createStudentRequestSchema;

export type UpdateStudentRequest = z.infer<typeof updateStudentRequestSchema>;
