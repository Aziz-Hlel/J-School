import z from 'zod';

export const createOwnerRequestSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().min(1, 'Phone number is required'),
});

export type CreateOwnerRequest = z.infer<typeof createOwnerRequestSchema>;
