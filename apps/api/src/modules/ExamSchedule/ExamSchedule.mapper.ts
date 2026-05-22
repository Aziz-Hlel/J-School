import { toCalendarDate, toTime } from '@/utils/dayjs';
import { ExamScheduleResponse } from '@repo/contracts/schemas/examSchedule/examScheduleResponse';
import { ExamScheduleGetPayload } from '@repo/db/prisma/models';

export class ExamScheduleMapper {
  static examScheduleResponse(examSchedule: ExamScheduleGetPayload<{ include: { exam: true } }>): ExamScheduleResponse {
    return {
      id: examSchedule.id,
      day: toCalendarDate(examSchedule.day),
      startTime: toTime(examSchedule.startTime),
      endTime: toTime(examSchedule.endTime),
      exam: {
        id: examSchedule.exam.id,
        name: {
          en: examSchedule.exam.name_en,
          fr: examSchedule.exam.name_fr,
          ar: examSchedule.exam.name_ar,
        },
        durationInMin: examSchedule.exam.durationInMin,
      },
    };
  }
}
