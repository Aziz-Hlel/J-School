import type { AttendanceSyncInput } from '@repo/contracts/schemas/Attendance/sync';
import prisma from '@repo/db';

export class AttendanceService {
  constructor() {}
  create = async () => {};
  update = async () => {};
  delete = async () => {};
  find = async () => {};

  sync = async (params: { schoolId: string; input: AttendanceSyncInput }) => {
    const { schoolId, input } = params;

    await prisma.$transaction(async (tx) => {
      const upsertQueries = input.students.map(async (student) => {
        await tx.attendance.upsert({
          where: {
            schoolId_week_timetableId_studentId: {
              schoolId,
              week: input.week,
              timetableId: input.timetableId,
              studentId: student.studentId,
            },
          },
          update: {
            status: student.status,
            note: student.note,
          },
          create: {
            schoolId,
            week: input.week,
            timetableId: input.timetableId,
            studentId: student.studentId,
            status: student.status,
            note: student.note,
          },
        });
      });

      await Promise.all(upsertQueries);
    });
  };
}
