import { TX } from '@/types/prisma/PrismaTransaction';
import { parseTime } from '@/utils/dayjs';
import prisma from '@repo/db';
import { ClassGrade, DayOfWeek } from '@repo/db/prisma/client';

export class TimetableSeed {
  constructor() {}

  run = async (
    params: {
      schoolId: string;
      subjectNameEn: string;
      classroomName: string;
      grade: ClassGrade;
      timetable: {
        day: DayOfWeek;
        startTime: string;
        endTime: string;
        room: string | null;
      };
    },
    tx?: TX,
  ) => {
    const client = prisma ?? tx;
    const assignment = await client.assignment.findFirst({
      where: {
        classroom: {
          schoolId: params.schoolId,
          name: params.classroomName,
          grade: params.grade,
        },
        subject: {
          schoolId: params.schoolId,
          name_en: params.subjectNameEn,
        },
      },
      select: { id: true },
    });

    if (!assignment)
      throw new Error(`Assignment not found for subject ${params.subjectNameEn} in classroom ${params.classroomName}`);

    await client.timetable.upsert({
      where: {
        schoolId_assignmentId_day_startTime: {
          schoolId: params.schoolId,
          assignmentId: assignment.id,
          day: params.timetable.day,
          startTime: parseTime(params.timetable.startTime),
        },
      },
      create: {
        schoolId: params.schoolId,
        assignmentId: assignment.id,
        day: params.timetable.day,
        startTime: parseTime(params.timetable.startTime),
        endTime: parseTime(params.timetable.endTime),
        room: params.timetable.room,
      },
      update: {
        day: params.timetable.day,
        startTime: parseTime(params.timetable.startTime),
        endTime: parseTime(params.timetable.endTime),
        room: params.timetable.room,
      },
    });
  };
}
