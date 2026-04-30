import { AccountRole, UserRole } from '@repo/db/prisma/client';
import z from 'zod';

export type NewAdminCustomClaims = {
  accountId: string;
  accountRole: AccountRole;
};

export const claimsSchema = z.object({
  accountId: z.uuid(),
  accountRole: z.enum(AccountRole),
});

export type Claims = z.infer<typeof claimsSchema>;
