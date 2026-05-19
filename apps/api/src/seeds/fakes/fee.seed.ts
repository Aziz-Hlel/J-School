import { TX } from '@/types/prisma/PrismaTransaction';
import { parseCalendarDate } from '@/utils/dayjs';
import prisma from '@repo/db';

export class FeeSeed {
  run = async (
    params: { id: string; studentId: string; name: string; startDate: string; endDate: string; schoolId: string },
    tx?: TX,
  ) => {
    const { id, studentId, name, startDate, endDate, schoolId } = params;
    const client = tx || prisma;

    await client.fees.upsert({
      where: {
        id,
      },
      update: {},
      create: {
        id,
        studentId,
        name,
        startDate: parseCalendarDate(startDate),
        endDate: parseCalendarDate(endDate),
        schoolId: schoolId,
      },
    });
  };
}
