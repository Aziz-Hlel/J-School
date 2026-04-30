import type z from 'zod';
import { GrantSimpleRoleRequestSchema } from './grantSimpleRoleRequest';

export const RevokeSimpleRoleRequestSchema = GrantSimpleRoleRequestSchema;

export type RevokeSimpleRoleRequest = z.infer<typeof RevokeSimpleRoleRequestSchema>;
