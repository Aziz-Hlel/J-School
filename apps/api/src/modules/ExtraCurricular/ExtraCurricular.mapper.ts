import { globalMediaService } from '@/media/media.service';
import { toCalendarDate, toTime } from '@/utils/dayjs';
import type { ExtraCurricularResponse } from '@repo/contracts/schemas/extraCurricular/extraCurricularResponse';
import type { Prisma } from '@repo/db/prisma/client';

export class ExtraCurricularMapper {
  static toResponse(
    input: Prisma.ExtraCurricularGetPayload<{
      include: {
        title: true;
        session: true;
        teacher: { include: { user: { include: { account: { include: { avatar: true } } } } } };
      };
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
        date: input.session?.startTime ? toCalendarDate(input.session.date) : null,
        startTime: input.session?.startTime ? toTime(input.session.startTime) : null,
        endTime: input.session?.endTime ? toTime(input.session.endTime) : null,
        type: input.session?.type ?? null,
      },
      teacher: input.teacher
        ? {
            id: input.teacher.id,
            firstName: input.teacher.user.firstName,
            lastName: input.teacher.user.lastName,
            gender: input.teacher.user.gender,
            avatar: globalMediaService.toMediaRes(input.teacher.user.account.avatar),
          }
        : null,
      createdAt: input.createdAt.toISOString(),
    };
  }
}
