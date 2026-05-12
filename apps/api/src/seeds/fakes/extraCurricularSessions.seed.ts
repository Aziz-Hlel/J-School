import { parseTime } from '@/utils/dayjs';
import prisma from '@repo/db';
import { DayOfWeek, SessionType } from '@repo/db/prisma/enums';

export class ExtraCurricularSessionsSeed {
  run = async (params: {
    id: string;
    day: DayOfWeek;
    startTime: string;
    endTime: string;
    extraCurricularId: string;
  }) => {
    const { startTime, endTime, day, extraCurricularId, id } = params;

    await prisma.session.upsert({
      where: { id },
      create: {
        id,
        day,
        startTime: parseTime(startTime),
        endTime: parseTime(endTime),
        extraCurricularId,
        type: SessionType.WEEKLY,
      },
      update: {},
    });
  };
}
