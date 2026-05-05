import { toTime } from '@/utils/dayjs';
import type { ExtraCurricularResponse } from '@repo/contracts/schemas/extraCurricular/extraCurricularResponse';
import type { Prisma } from '@repo/db/prisma/client';

export class ExtraCurricularMapper {
  static toResponse(
    input: Prisma.ExtraCurricularGetPayload<{
      include: { title: true; session: true; teacher: { include: { user: true } } };
    }>,
  ): ExtraCurricularResponse {
    return {
      id: input.id,
      title: {
        en: input.title?.en ?? '', // *
        fr: input.title?.fr ?? '',
        ar: input.title?.ar ?? '',
      },
      session: {
        day: input.session?.day ?? null,
        startTime: input.session?.startTime ? toTime(input.session.startTime) : null,
        endTime: input.session?.endTime ? toTime(input.session.endTime) : null,
      },
      teacher: input.teacher
        ? {
            id: input.teacher.id,
            firstName: input.teacher.user.firstName,
            lastName: input.teacher.user.lastName,
            gender: input.teacher.user.gender,
          }
        : null,
      createdAt: input.createdAt.toISOString(),
    };
  }
}
