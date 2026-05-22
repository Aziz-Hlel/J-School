import z from 'zod';
export const updateNotification2ReqSchema = z.object({
  //TODO: define schema
});

export type UpdateNotification2Req = z.infer<typeof updateNotification2ReqSchema>;
