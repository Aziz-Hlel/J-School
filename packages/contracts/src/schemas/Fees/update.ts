import z from 'zod';
import { globalFeeSchema } from '../shared/fee.shcema';

export const updateFeesReqSchema = z.object({
  name: globalFeeSchema.name,
  startDate: globalFeeSchema.startDate,
  endDate: globalFeeSchema.endDate,
});

export type UpdateFeesReq = z.infer<typeof updateFeesReqSchema>;
