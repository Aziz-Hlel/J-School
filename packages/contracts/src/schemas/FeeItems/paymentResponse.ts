import type { PaymentMethod } from '@repo/db/prisma/enums';

export type PaymentResponse = {
  id: string;
  method: PaymentMethod;
  date: string | null;
  reference: string | null;
};
