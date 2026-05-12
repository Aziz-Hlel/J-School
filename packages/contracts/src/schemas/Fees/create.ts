import z from 'zod';
import { globalFeeSchema } from '../shared/fee.shcema';

export const createFeesReqSchema = z.object({
  name: globalFeeSchema.name,
  studentId: globalFeeSchema.studentId,
  startDate: globalFeeSchema.startDate,
  endDate: globalFeeSchema.endDate,
});

export type CreateFeesReq = z.infer<typeof createFeesReqSchema>;
