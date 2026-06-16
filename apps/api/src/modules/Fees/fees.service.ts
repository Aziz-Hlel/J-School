import { PrismaErrorCode } from '@/err/repo/PrismaErrorCode';
import { NotFoundError } from '@/err/service/customErrors';
import { parseCalendarDate } from '@/utils/dayjs';
import { CreateFeesReq } from '@repo/contracts/schemas/Fees/create';
import { UpdateFeesReq } from '@repo/contracts/schemas/Fees/update';
import prisma from '@repo/db';
import { Prisma } from '@repo/db/prisma/client';
import { FeesMapper } from './fees.mapper';

export class FeesService {
  create = async (params: { schoolId: string; input: CreateFeesReq }) => {
    const { schoolId, input } = params;

    const createdFee = await prisma.fees.create({
      data: {
        name: input.name,
        studentId: input.studentId,
        startDate: parseCalendarDate(input.startDate),
        endDate: parseCalendarDate(input.endDate),
        schoolId,
      },
    });
    const response = FeesMapper.toResponse({ ...createdFee, feeItems: [] });
    return response;
  };

  update = async (params: { schoolId: string; feeId: string; input: UpdateFeesReq }) => {
    const { schoolId, input } = params;
    try {
      const updatedFee = await prisma.fees.update({
        where: {
          id: params.feeId,
          schoolId,
        },
        data: {
          name: input.name,
          startDate: parseCalendarDate(input.startDate),
          endDate: parseCalendarDate(input.endDate),
        },
        include: { feeItems: { include: { payment: true } } },
      });
      const response = FeesMapper.toResponse(updatedFee);
      return response;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === PrismaErrorCode.NOT_FOUND)
        throw new NotFoundError('Fee not found');
      throw error;
    }
  };

  delete = async ({ schoolId, feeId }: { schoolId: string; feeId: string }) => {
    try {
      await prisma.fees.delete({
        where: {
          id: feeId,
          schoolId,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === PrismaErrorCode.NOT_FOUND) return;
      throw error;
    }
  };

  findById = async ({ schoolId, feeId }: { schoolId: string; feeId: string }) => {
    try {
      const fee = await prisma.fees.findUnique({
        where: {
          id: feeId,
          schoolId,
        },
        include: { feeItems: { include: { payment: true } } },
      });
      if (!fee) throw new NotFoundError('Fee not found');
      const response = FeesMapper.toResponse(fee);
      return response;
    } catch (error) {
      throw error;
    }
  };
}
