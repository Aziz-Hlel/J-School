import z from 'zod';
export const feesCreateDto = z.object({
  //TODO: define schema
});

export type FeesCreateInput = z.infer<typeof feesCreateDto>;
