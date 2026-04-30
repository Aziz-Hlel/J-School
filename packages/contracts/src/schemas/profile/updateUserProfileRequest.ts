import z from 'zod';

export const updateUserProfileRequestSchema = z.object({
  username: z.string().min(3).max(30).nullable(),
  email: z.email(),
  // password: z.string().min(6).max(10),

  profile: z.object({
    phoneNumber: z.string().nullable(),
    address: z.string().nullable(),
  }),
});

export type UpdateUserProfileRequest = z.infer<typeof updateUserProfileRequestSchema>;
