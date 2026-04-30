import z from 'zod';
import { userRolesSimple } from '../../types/enums/meta/userRoleMeta';

export const GrantSimpleRoleRequestSchema = z.object({
  role: z.enum(userRolesSimple, { error: 'Invalid role' }),
});

export type GrantSimpleRoleRequest = z.infer<typeof GrantSimpleRoleRequestSchema>;
