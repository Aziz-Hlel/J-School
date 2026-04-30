import z from 'zod';
import { createSimpleUserRequestSchema } from '../user/createSimpleUserRequest';
import { userRolesStaff } from '../../types/enums/meta/userRoleMeta';

export const createStaffRequestSchema = createSimpleUserRequestSchema.extend({
  role: z.enum(userRolesStaff),
});

export type CreateStaffRequest = z.infer<typeof createStaffRequestSchema>;
