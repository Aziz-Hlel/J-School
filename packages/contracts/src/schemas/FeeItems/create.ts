import z from 'zod';
import { globalFeeItemsSchema } from '../shared/feeItem.schema';
export const createFeeItemsReqSchema = z.object({
  title: globalFeeItemsSchema.title,
  description: globalFeeItemsSchema.description,
  amount: globalFeeItemsSchema.amount,
  status: globalFeeItemsSchema.status,
});

export type CreateFeeItemsReq = z.infer<typeof createFeeItemsReqSchema>;
