import z from 'zod';
export const notification2ResponseSchema = z.object({
  //TODO: define schema
});

export type Notification2Response = z.infer<typeof notification2ResponseSchema>;
