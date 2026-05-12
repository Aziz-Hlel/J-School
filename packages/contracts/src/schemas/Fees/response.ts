import z from 'zod';
export const feesResponseSchema = z.object({
  //TODO: define schema
});

export type FeesResponse = z.infer<typeof feesResponseSchema>;
