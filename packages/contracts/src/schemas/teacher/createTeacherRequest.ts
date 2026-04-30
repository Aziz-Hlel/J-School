import z from 'zod';
import { createSimpleUserRequestSchema } from '../user/createSimpleUserRequest';

export const createTeacherRequestSchema = createSimpleUserRequestSchema.omit({
  role: true,
});

export type CreateTeacherRequest = z.infer<typeof createTeacherRequestSchema>;
