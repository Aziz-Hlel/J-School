import { NotFoundError } from '@/err/service/customErrors';
import { parseTime } from '@/utils/dayjs';
import type { CreateExtraCurricularReq } from '@repo/contracts/schemas/extraCurricular/createExtraCurricularRequest';
import type { UpdateExtraCurricularReq } from '@repo/contracts/schemas/extraCurricular/updateExtraCurricularReq';
import prisma from '@repo/db';
import { SessionType } from '@repo/db/prisma/enums';

export class ExtraCurricularService {
  create = async (params: { input: CreateExtraCurricularReq; schoolId: string }) => {
    const { input, schoolId } = params;

    return await prisma.$transaction(async (tx) => {
      const title = await tx.name.create({
        data: {
          en: input.title.en,
          fr: input.title.fr,
          ar: input.title.ar,
          schoolId: schoolId,
        },
      });

      const session = await tx.session.create({
        data: {
          type: SessionType.WEEKLY,
          day: input.dayOfWeek,
          startTime: parseTime(input.startTime),
          endTime: parseTime(input.endTime),
        },
      });

      const createdExtraCurricular = await tx.extraCurricular.create({
        data: {
          titleId: title.id,
          sessionId: session.id,
          teacherId: input.teacherId,
          schoolId: schoolId,
        },
      });

      return createdExtraCurricular;
    });
  };

  update = async (params: { input: UpdateExtraCurricularReq; schoolId: string; extraCurricularId: string }) => {
    const { input, schoolId, extraCurricularId } = params;

    return await prisma.$transaction(async (tx) => {
      const extraCurricular = await tx.extraCurricular.update({
        where: {
          id: extraCurricularId,
          schoolId,
        },
        data: {
          teacherId: input.teacherId,
          title: {
            update: {
              en: input.title.en,
              fr: input.title.fr,
              ar: input.title.ar,
            },
          },
        },
      });
    });
  };
}
