import { logger } from '@/bootstrap/logger.init';
import { PrismaErrorCode } from '@/err/repo/PrismaErrorCode';
import { NotFoundError } from '@/err/service/customErrors';
import { feeItemNotification } from '@/template/notification/feeItem';
import { toDate } from '@/utils/toDate';
import { CreateFeeItemsReq } from '@repo/contracts/schemas/FeeItems/create';
import { UpdateFeeItemsReq } from '@repo/contracts/schemas/FeeItems/update';
import prisma from '@repo/db';
import { NotificationSourceType, NotificationType, Prisma, UserRole } from '@repo/db/prisma/client';
import { globalNotificationService } from '../Notification/notification.service';
import { FeeItemsMapper } from './feeItems.mapper';

export class FeeItemsService {
  constructor() {}
  create = async (params: { input: CreateFeeItemsReq; schoolId: string; feeId: string }) => {
    const { input, feeId, schoolId } = params;

    const createdFeeItem = await prisma.feeItem.create({
      data: {
        feeId,
        title: input.title,
        description: input.description,
        amount: input.amount,
        status: input.status,
        payment: input.payment
          ? {
              create: {
                method: input.payment.method,
                reference: input.payment.reference,
                date: toDate(input.payment.date),
              },
            }
          : undefined,
      },
      include: {
        payment: true,
      },
    });

    try {
      const sutdentFeeQuery = await prisma.fees.findUnique({
        where: {
          id: feeId,
        },
        select: {
          studentId: true,
        },
      });
      if (!sutdentFeeQuery) throw new Error('Student id not found by fee id');

      const parentAccountIds = await prisma.studentParents.findMany({
        where: {
          studentId: sutdentFeeQuery.studentId,
        },
        select: {
          parent: {
            select: {
              user: {
                select: {
                  account: {
                    select: {
                      id: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      await globalNotificationService.create({
        input: {
          schoolId,
          sourceId: createdFeeItem.id,
          type: {
            type: NotificationType.GROUP,
            accountIds: parentAccountIds.map((x) => x.parent.user.account.id),
          },
          title: feeItemNotification.title(),
          content: feeItemNotification.content(),
          sourceType: NotificationSourceType.FEES,
          userRole: UserRole.PARENT,
          studentIds: [sutdentFeeQuery.studentId],
        },
      });
    } catch (error) {
      logger.error(error, 'Failed to create fee item notification');
    }

    const response = FeeItemsMapper.toResponse(createdFeeItem);

    return response;
  };

  update = async (params: { input: UpdateFeeItemsReq; schoolId: string; feeItemId: string }) => {
    const { input, feeItemId } = params;

    try {
      const updatedFeeItem = await prisma.feeItem.update({
        where: { id: feeItemId },
        data: {
          title: input.title,
          amount: input.amount,
          description: input.description ?? null,
          status: input.status,
          payment: input.payment
            ? {
                upsert: {
                  create: {
                    method: input.payment.method,
                    reference: input.payment.reference,
                    date: toDate(input.payment.date),
                  },
                  update: {
                    method: input.payment.method,
                    reference: input.payment.reference,
                    date: toDate(input.payment.date),
                  },
                },
              }
            : undefined,
        },
        include: {
          payment: true,
        },
      });
      const response = FeeItemsMapper.toResponse(updatedFeeItem);
      return response;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === PrismaErrorCode.NOT_FOUND) {
        throw new NotFoundError({ message: `Fee item with id ${feeItemId} not found`, cause: error });
      }
      throw error;
    }
  };

  delete = async (params: { feeItemId: string }) => {
    const { feeItemId } = params;
    try {
      await prisma.feeItem.delete({
        where: { id: feeItemId },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === PrismaErrorCode.NOT_FOUND) {
        return;
      }
      throw error;
    }
  };
}
