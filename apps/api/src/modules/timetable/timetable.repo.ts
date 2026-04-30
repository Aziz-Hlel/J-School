import { prisma } from '@/bootstrap/db.init';
import { TX } from '@/types/prisma/PrismaTransaction';
import { parseTime } from '@/utils/dayjs';
import { CreateTimetableRequest } from '@repo/contracts/schemas/timeTable/createTimetableRequest';
import { updateTimetableRequest } from '@repo/contracts/schemas/timeTable/updateTimetableRequest';

export class TimetableRepo {
  create = async (params: { input: CreateTimetableRequest; assignmentId: string; schoolId: string }, tx?: TX) => {
    const { input, schoolId, assignmentId } = params;
    const client = tx ?? prisma;
    return await client.timetable.create({
      data: {
        schoolId,
        assignmentId,
        day: input.day,
        startTime: parseTime(input.startTime),
        endTime: parseTime(input.endTime),
      },
    });
  };

  update = async (params: { input: updateTimetableRequest; timetableId: string; schoolId: string }, tx?: TX) => {
    const { input, schoolId, timetableId } = params;
    const client = tx ?? prisma;
    return await client.timetable.update({
      where: {
        id: timetableId,
        schoolId,
      },
      data: {
        day: input.day,
        startTime: parseTime(input.startTime),
        endTime: parseTime(input.endTime),
      },
    });
  };

  deleteMany = async (params: { timetableId: string; schoolId: string }, tx?: TX) => {
    const { timetableId, schoolId } = params;
    const client = tx ?? prisma;
    const deleted = await client.timetable.deleteMany({
      where: {
        id: timetableId,
        schoolId,
      },
    });

    return deleted.count;
  };
}
