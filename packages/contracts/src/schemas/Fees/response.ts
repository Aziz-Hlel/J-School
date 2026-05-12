import type { FeeItemStatus } from '../../types/enums/enums';
import type { FeeItemsResponse } from '../FeeItems/response';

export type FeesResponse = {
  id: string;
  name: string | null;
  studentId: string;
  startDate: string;
  endDate: string;
  items: FeeItemsResponse[];
  status: FeeItemStatus;
  createdAt: string;
};
