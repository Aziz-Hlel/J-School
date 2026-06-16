import { toCalendarDate } from '@/utils/dayjs';
import { FeeItemsResponse } from '@repo/contracts/schemas/FeeItems/response';
import { FeeItemGetPayload } from '@repo/db/prisma/models';

export class FeeItemsMapper {
  static toResponse(
    feeItem: FeeItemGetPayload<{
      include: {
        payment: true;
      };
    }>,
  ): FeeItemsResponse {
    return {
      id: feeItem.id,
      title: feeItem.title,
      description: feeItem.description,
      amount: feeItem.amount,
      status: feeItem.status,
      payment: feeItem.payment
        ? {
            id: feeItem.payment.id,
            method: feeItem.payment.method,
            reference: feeItem.payment.reference,
            date: toCalendarDate(feeItem.payment.date),
          }
        : null,
      createdAt: feeItem.createdAt.toISOString(),
      updatedAt: feeItem.updatedAt.toISOString(),
    };
  }
}
