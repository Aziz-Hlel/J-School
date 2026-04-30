import z from 'zod';
import { updateStudentRequestSchema } from './updateStudentRequest';
import { createStudentProfileRequestSchema } from '../studentProfile/createStudentProfileRequest';

export const updateStudentWithProfileRequestSchema = updateStudentRequestSchema.and(
  z.object({ profile: createStudentProfileRequestSchema.nullable() }),
);

export type UpdateStudentWithProfileRequest = z.infer<typeof updateStudentWithProfileRequestSchema>;
