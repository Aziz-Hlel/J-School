import z from 'zod';
import { createUserV2Schema } from '../user/v2/createUserSchema';

export const createParentRequestSchema = createUserV2Schema;

export type CreateParentRequest = z.infer<typeof createParentRequestSchema>;
