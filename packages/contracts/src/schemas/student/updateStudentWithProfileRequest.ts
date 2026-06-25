import z from 'zod';
import { createStudentProfileRequestSchema } from '../studentProfile/createStudentProfileRequest';
import { updateStudentWithStatusRequestSchema } from './updateStudentWithStatusRequest';

export const updateStudentWithProfileRequestSchema = updateStudentWithStatusRequestSchema.and(
  z.object({ profile: createStudentProfileRequestSchema.nullable() }),
);

export type UpdateStudentWithProfileRequest = z.infer<typeof updateStudentWithProfileRequestSchema>;
