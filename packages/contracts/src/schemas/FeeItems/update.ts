import z from 'zod';
import { globalFeeItemsSchema } from '../shared/feeItem.schema';
import { createPaymentReqSchema } from './createPayment';

export const updateFeeItemsReqSchema = z.object({
  title: globalFeeItemsSchema.title,
  description: globalFeeItemsSchema.description,
  amount: globalFeeItemsSchema.amount,
  status: globalFeeItemsSchema.status,
  payment: createPaymentReqSchema.nullable(),
});

export type UpdateFeeItemsReq = z.infer<typeof updateFeeItemsReqSchema>;
