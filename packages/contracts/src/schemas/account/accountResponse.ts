import z from 'zod';
import { dateStringSchema, uuidSchema } from '../utils/generalZod';
import { mediaResponseSchema } from '../media/MediaResponse';
import { AccountRole } from '../../types/enums/enums';

const accountResponseSchema = z.object({
  id: uuidSchema,
  authId: z.string(),
  email: z.email().nullable(),
  avatar: mediaResponseSchema.nullable(),
  role: z.enum(AccountRole),
  createdAt: dateStringSchema(),
  updatedAt: dateStringSchema(),
});

export type AccountResponse = z.infer<typeof accountResponseSchema>;
