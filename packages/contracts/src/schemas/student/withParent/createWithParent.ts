import z from 'zod';
import { globalAccountSchema } from '../../shared/account.schema';
import { globalUserSchema } from '../../shared/user.schema';
import { createStudentWithProfileRequestSchema } from '../createStudentWithProfile';
import { globalParentSchema } from '../../shared/parent.schema';

const parentSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('NEW'),
    email: globalAccountSchema.email,
    password: globalAccountSchema.password,
    firstName: globalUserSchema.firstName,
    lastName: globalUserSchema.lastName,
    gender: globalUserSchema.gender,
    dateOfBirth: globalUserSchema.dateOfBirth,
    phone: globalUserSchema.phone,
    emergencyPhone: globalParentSchema.emergencyPhone,
    cin: globalUserSchema.cin,
    address: globalUserSchema.address,
  }),
  z.object({
    type: z.literal('EXISTING'),
    id: z.uuid(),
  }),
]);

export const createStudentWithParentSchema = createStudentWithProfileRequestSchema.and(
  z.object({
    parent: parentSchema,
  }),
);

//   z.discriminatedUnion('type', [
//     z.object({
//       parent: createParentRequestSchema.and(z.object({ type: z.literal('NEW') })),
//     }),
//     z.object({
//       parent: z.object({ type: z.literal('EXISTING'), id: z.uuid() }),
//     }),
//   ]),
// );

export type CreateStudentWithParentRequest = z.infer<typeof createStudentWithParentSchema>;
