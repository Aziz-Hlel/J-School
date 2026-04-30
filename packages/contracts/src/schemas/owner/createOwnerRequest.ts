import z from 'zod';

export const createOwnerRequestSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string(),
});

export type CreateOwnerRequest = z.infer<typeof createOwnerRequestSchema>;
