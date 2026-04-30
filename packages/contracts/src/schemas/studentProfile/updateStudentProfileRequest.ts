import type z from 'zod';
import { createStudentProfileRequestSchema } from './createStudentProfileRequest';

export const updateStudentProfileRequestSchema = createStudentProfileRequestSchema;

export type UpdateStudentProfileRequest = z.infer<typeof updateStudentProfileRequestSchema>;
