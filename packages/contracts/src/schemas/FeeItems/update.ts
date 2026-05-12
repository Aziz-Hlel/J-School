import z from 'zod';
import { globalFeeItemsSchema } from '../shared/feeItem.schema';
export const updateFeeItemsReqSchema = z.object({
  title: globalFeeItemsSchema.title,
  description: globalFeeItemsSchema.description,
  amount: globalFeeItemsSchema.amount,
  status: globalFeeItemsSchema.status,
});

export type UpdateFeeItemsReq = z.infer<typeof updateFeeItemsReqSchema>;
