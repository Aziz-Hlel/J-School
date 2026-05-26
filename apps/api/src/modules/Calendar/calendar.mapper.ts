import { toCalendarDate, toTime } from '@/utils/dayjs';
import { CalendarResponse } from '@repo/contracts/schemas/Calendar/response';
import { Calendar } from '@repo/db/prisma/client';

export class CalendarMapper {
  static toResponse(data: Calendar): CalendarResponse {
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      type: data.type,
      startDate: toCalendarDate(data.startDate),
      startTime: toTime(data.startTime),
      endDate: toCalendarDate(data.endDate),
      endTime: toTime(data.endTime),
      createdAt: data.createdAt.toISOString(),
      updatedAt: data.updatedAt.toISOString(),
    };
  }
}
