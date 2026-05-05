import { parseTime } from '@/utils/dayjs';
import type { CreateExtraCurricularReq } from '@repo/contracts/schemas/extraCurricular/createExtraCurricularRequest';
import type { UpdateExtraCurricularReq } from '@repo/contracts/schemas/extraCurricular/updateExtraCurricularReq';
import prisma from '@repo/db';
import { SessionType } from '@repo/db/prisma/enums';

export class ExtraCurricularService {
  create = async (params: { input: CreateExtraCurricularReq; schoolId: string }) => {
    const { input, schoolId } = params;

    return await prisma.$transaction(async (tx) => {
      const createdExtraCurricular = await tx.extraCurricular.create({
        data: {
          title: {
            create: {
              en: input.title.en,
              fr: input.title.fr,
              ar: input.title.ar,
              schoolId: schoolId,
            },
          },
          session: {
            create: {
              type: SessionType.WEEKLY,
              day: input.dayOfWeek,
              startTime: parseTime(input.startTime),
              endTime: parseTime(input.endTime),
            },
          },
          teacherId: input.teacherId,
          schoolId: schoolId,
        },
      });

      return createdExtraCurricular;
    });
  };

  update = async (params: { input: UpdateExtraCurricularReq; schoolId: string; extraCurricularId: string }) => {
    const { input, schoolId, extraCurricularId } = params;
    const extraCurricular = await prisma.extraCurricular.update({
      where: {
        id: extraCurricularId,
        schoolId,
      },
      data: {
        teacher: input.teacherId ? { connect: { id: input.teacherId } } : { disconnect: true },
        title: {
          update: {
            en: input.title.en,
            fr: input.title.fr,
            ar: input.title.ar,
          },
        },
        session: {
          update: {
            startTime: input.startTime ? parseTime(input.startTime) : undefined,
            endTime: input.endTime ? parseTime(input.endTime) : undefined,
          },
        },
      },
    });
    return { id: extraCurricular.id };
  };

  delete = async (params: { schoolId: string; extraCurricularId: string }) => {
    const { schoolId, extraCurricularId } = params;
    await prisma.extraCurricular.deleteMany({
      where: {
        id: extraCurricularId,
        schoolId,
      },
    });
    return;
  };
}
