import { parseTime } from '@/utils/dayjs';
import { toDate } from '@/utils/toDate';
import prisma from '@repo/db';
import { DayOfWeek, SessionType } from '@repo/db/prisma/enums';

export class ExtraCurricularSessionsSeed {
  run = async (params: {
    id: string;
    day?: DayOfWeek;
    date?: string;
    startTime: string;
    endTime?: string;
    extraCurricularId: string;
    type: SessionType;
  }) => {
    const { startTime, endTime, day, date, extraCurricularId, id, type } = params;

    await prisma.session.upsert({
      where: { id },
      create: {
        id,
        type,
        day: day ?? null,
        date: toDate(date ?? null),
        startTime: parseTime(startTime),
        endTime: parseTime(endTime ?? null),
        extraCurricularId,
      },
      update: {
        type,
        day: day ?? null,
        date: toDate(date ?? null),
        startTime: parseTime(startTime),
        endTime: parseTime(endTime ?? null),
      },
    });
  };
}
