import { z } from 'zod';
import { updateSimpleUserRequestSchema } from '../user/updateSimpleUserRequest';

export const updateStaffRequestSchema = updateSimpleUserRequestSchema;

export type UpdateStaffRequest = z.infer<typeof updateStaffRequestSchema>;
