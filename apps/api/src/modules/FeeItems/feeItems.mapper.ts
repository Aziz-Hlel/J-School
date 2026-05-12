import { FeeItemsResponse } from '@repo/contracts/schemas/FeeItems/response';
import { FeeItem } from '@repo/db/prisma/client';

export class FeeItemsMapper {
  static toResponse(feeItem: FeeItem): FeeItemsResponse {
    return {
      id: feeItem.id,
      title: feeItem.title,
      description: feeItem.description,
      amount: feeItem.amount,
      status: feeItem.status,
      createdAt: feeItem.createdAt.toISOString(),
      updatedAt: feeItem.updatedAt.toISOString(),
    };
  }
}
