import z from 'zod';
import { createUserV2Schema } from '../user/v2/createUserSchema';
import { globalParentSchema } from '../shared/parent.schema';

export const createParentRequestSchema = createUserV2Schema.extend({
  emergencyPhone: globalParentSchema.emergencyPhone,
});

export type CreateParentRequest = z.infer<typeof createParentRequestSchema>;
