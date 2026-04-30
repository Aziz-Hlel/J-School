import z from 'zod';
import { userRolesSimple } from '../../types/enums/meta/userRoleMeta';
import { globalAccountSchema } from '../shared/account.schema';
import { globalUserSchema } from '../shared/user.schema';

export const createSimpleUserRequestSchema = z.object({
  firstName: globalUserSchema.firstName,

  lastName: globalUserSchema.lastName,

  gender: globalUserSchema.gender,

  dateOfBirth: globalUserSchema.dateOfBirth,

  phone: globalUserSchema.phone,

  cin: globalUserSchema.cin,

  address: globalUserSchema.address,

  email: globalAccountSchema.email,

  role: z.enum(userRolesSimple),

  password: globalAccountSchema.password.or(z.null()),
});

export type CreateSimpleUserRequest = z.infer<typeof createSimpleUserRequestSchema>;
