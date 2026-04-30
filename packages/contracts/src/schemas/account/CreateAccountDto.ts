import z from 'zod';
export const CreateAccountSchema = z.object({
  token: z.string({ error: 'tokenId is required' }).nonempty({ error: 'tokenId cannot be empty' }),
});

export type CreateAccountDto = z.infer<typeof CreateAccountSchema>;
