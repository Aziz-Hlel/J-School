import { Timetable } from '@repo/db/prisma/client';
import { toTime } from '@/utils/dayjs';
import { TimetableResponse } from '@repo/contracts/schemas/timeTable/timetableResponse';

export class TimetableMapper {
  static toResponse(timetable: Timetable): TimetableResponse {
    return {
      id: timetable.id,
      assignmentId: timetable.assignmentId,
      day: timetable.day,
      startTime: toTime(timetable.startTime),
      endTime: toTime(timetable.endTime),
      createdAt: timetable.createdAt.toISOString(),
      updatedAt: timetable.updatedAt.toISOString(),
    };
  }
}
