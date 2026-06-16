import type { FeeItemStatus } from '../../types/enums/enums';
import type { PaymentResponse } from './paymentResponse';

export type FeeItemsResponse = {
  id: string;
  title: string;
  description: string | null;
  amount: number;
  status: FeeItemStatus;
  payment: PaymentResponse | null;
  createdAt: string;
  updatedAt: string;
};
