import z from 'zod';
import { FeeItemStatus } from '../../types/enums/enums';

export const globalFeeItemsSchema = {
  feeId: z.uuid(),
  title: z.string().trim().nonempty('title is required').max(255, 'title is too long, max 255 characters allowed'),
  description: z.string().trim().max(1000, 'description is too long, max 1000 characters allowed').optional(),
  amount: z.number().positive(),
  status: z.enum(FeeItemStatus),
};
