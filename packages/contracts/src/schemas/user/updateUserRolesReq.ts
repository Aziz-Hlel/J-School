import { UserRole } from '@repo/db/prisma/enums';
import z from 'zod';

export const updateUserRolesReqSchema = z.object({
  roles: z.array(z.enum(UserRole)),
});

export type UpdateUserRolesReq = z.infer<typeof updateUserRolesReqSchema>;
