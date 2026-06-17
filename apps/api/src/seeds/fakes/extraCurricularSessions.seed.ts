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
    type: SessionType;
  }) => {
    const { startTime, endTime, day, extraCurricularId, id, type } = params;

    await prisma.session.upsert({
      where: { id },
      create: {
        id,
        day,
        type,
        startTime: parseTime(startTime),
        endTime: parseTime(endTime),
        extraCurricularId,
      },
      update: {
        type,
      },
    });
  };
}
