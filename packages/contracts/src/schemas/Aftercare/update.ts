import z from 'zod';
export const updateAftercareReqSchema = z.object({
  //TODO: define schema
});

export type UpdateAftercareReq = z.infer<typeof updateAftercareReqSchema>;
