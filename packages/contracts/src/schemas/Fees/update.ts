import z from 'zod';
export const feesUpdateDto = z.object({
  //TODO: define schema
});

export type FeesUpdateInput = z.infer<typeof feesUpdateDto>;
