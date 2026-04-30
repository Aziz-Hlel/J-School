import type z from 'zod';
import { updateSimpleUserRequestSchema } from '../user/updateSimpleUserRequest';

export const updateTeacherRequestSchema = updateSimpleUserRequestSchema;

export type UpdateTeacherRequest = z.infer<typeof updateTeacherRequestSchema>;
