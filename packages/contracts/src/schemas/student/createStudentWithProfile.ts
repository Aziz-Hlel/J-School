import z from 'zod';
import { createStudentRequestSchema } from './createStudentRequest';
import { createStudentProfileRequestSchema } from '../studentProfile/createStudentProfileRequest';

export const createStudentWithProfileRequestSchema = createStudentRequestSchema.and(
  z.object({ profile: createStudentProfileRequestSchema.nullable() }),
);

export type CreateStudentWithProfileRequest = z.infer<typeof createStudentWithProfileRequestSchema>;
