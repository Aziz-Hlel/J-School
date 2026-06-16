import { PaymentMethod } from '@repo/db/prisma/enums';
import z from 'zod';

export const createPaymentReqSchema = z.object({
  method: z.enum(PaymentMethod),
  reference: z.string().nullable(),
  date: z.iso.date().nullable(),
});

export type CreatePaymentReq = z.infer<typeof createPaymentReqSchema>;
