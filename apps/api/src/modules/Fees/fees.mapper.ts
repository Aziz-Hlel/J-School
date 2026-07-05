import { FeesResponse } from '@repo/contracts/schemas/Fees/response';
import { FeeItemStatus } from '@repo/db/prisma/client';
import { FeesGetPayload } from '@repo/db/prisma/models';
import { FeeItemsMapper } from '../FeeItems/feeItems.mapper';
import { toCalendarDate } from '@/utils/dayjs';

export class FeesMapper {
  static toResponse = (
    data: FeesGetPayload<{ include: { feeItems: { include: { payment: true } } } }>,
  ): FeesResponse => {
    const paidFees = data.feeItems.filter((item) => item.status === FeeItemStatus.PAID);
    let feeStatus: FeeItemStatus = FeeItemStatus.UNPAID;
    if (paidFees.length !== 0) {
      feeStatus = FeeItemStatus.PARTIALLY_PAID;
    }
    if (paidFees.length === data.feeItems.length) {
      feeStatus = FeeItemStatus.PAID;
    }

    const feeItemsResponse = data.feeItems.map(FeeItemsMapper.toResponse);

    return {
      id: data.id,
      name: data.name,
      studentId: data.studentId,
      startDate: toCalendarDate(data.startDate),
      endDate: toCalendarDate(data.endDate),
      status: feeStatus,
      items: feeItemsResponse,
      createdAt: data.createdAt.toISOString(),
    };
  };
}
