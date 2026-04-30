import z from 'zod';

export const createProfileSchema = z.object({
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
});

export type CreateProfileRequest = z.infer<typeof createProfileSchema>;
