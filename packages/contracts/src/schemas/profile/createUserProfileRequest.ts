import z from 'zod';

export const createUserProfileRequestSchema = z.object({
  username: z.string().min(3).max(30),
  email: z.email(),
  password: z.string().min(6).max(10),

  profile: z.object({
    phoneNumber: z.string().nullable(),
    address: z.string().nullable(),
  }),
});

export type CreateUserProfileRequest = z.input<typeof createUserProfileRequestSchema>;
export type CreateUserProfileSchemaOutput = z.infer<typeof createUserProfileRequestSchema>;
