import { NotFoundError } from '@/err/service/customErrors';
import { parseCalendarDate, parseTime } from '@/utils/dayjs';
import type { UpdateExamScheduleRequest } from '@repo/contracts/schemas/examSchedule/updateExamScheduleRequest';
import prisma from '@repo/db';

export class ExamScheduleService {
  constructor() {}

  // ? Spaghetti ( this one is a new low ..)
  update = async (params: { schoolId: string; input: UpdateExamScheduleRequest }) => {
    const examSchedule = await prisma.examSchedule.findFirst({
      where: {
        assignement: {
          schoolId: params.schoolId,
          classroomId: params.input.classroomId,
        },
        examId: params.input.examId,
      },
    });

    if (!examSchedule) throw new NotFoundError('Exam schedule not found');

    const updatedExamSchedule = await prisma.examSchedule.update({
      where: {
        id: examSchedule.id,
      },
      data: {
        day: params.input?.date?.day ? parseCalendarDate(params.input.date.day) : undefined,
        startTime: params.input?.date?.startTime ? parseTime(params.input.date.startTime) : undefined,
        endTime: params.input?.date?.endTime ? parseTime(params.input.date.endTime) : undefined,
      },
    });

    return updatedExamSchedule;
  };
}
