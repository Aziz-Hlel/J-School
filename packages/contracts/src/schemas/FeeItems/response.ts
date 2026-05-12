import type { FeeItemStatus } from '../../types/enums/enums';

export type FeeItemsResponse = {
  id: string;
  title: string;
  description: string | null;
  amount: number;
  status: FeeItemStatus;
  createdAt: string;
  updatedAt: string;
};
