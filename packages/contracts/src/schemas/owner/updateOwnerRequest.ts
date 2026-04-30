import z from 'zod';

export const updateOwnerRequestSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string(),
});

export type UpdateOwnerRequest = z.infer<typeof updateOwnerRequestSchema>;
