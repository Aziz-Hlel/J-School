import { logger } from '@/bootstrap/logger.init';
import { examScheduleNotification } from '@/template/notification/examSchedule';
import { parseCalendarDate, parseTime } from '@/utils/dayjs';
import { CreateExamScheduleRequest } from '@repo/contracts/schemas/examSchedule/createExamScheduleRequest';
import type { UpdateExamScheduleRequest } from '@repo/contracts/schemas/examSchedule/updateExamScheduleRequest';
import prisma from '@repo/db';
import { NotificationSourceType, NotificationType } from '@repo/db/prisma/browser';
import { globalNotificationService } from '../Notification/notification.service';
import { ExamScheduleMapper } from './ExamSchedule.mapper';

export class ExamScheduleService {
  constructor() {}

  create = async (params: { schoolId: string; input: CreateExamScheduleRequest }) => {
    const { schoolId, input } = params;

    const schedule = await prisma.examSchedule.create({
      data: {
        assignementId: input.assignmentId,
        examId: input.examId,
        day: input.date?.day ? parseCalendarDate(input.date?.day) : null,
        startTime: input.date?.startTime ? parseTime(input.date?.startTime) : null,
        endTime: input.date?.endTime ? parseTime(input.date?.endTime) : null,
        schoolId,
      },
    });

    try {
      const exam = await prisma.exam.findUnique({
        where: {
          id: input.examId,
        },
        select: {
          name_en: true,
          name_ar: true,
          name_fr: true,
        },
      });
      const examNames = exam
        ? {
            en: exam.name_en,
            ar: exam.name_ar,
            fr: exam.name_fr,
          }
        : undefined;

      const classroomIdQueryRes = await prisma.assignment.findUnique({
        where: {
          id: input.assignmentId,
        },
        select: {
          classroomId: true,
        },
      });
      if (!classroomIdQueryRes) throw new Error('ClassroomId not found ');

      const parentIdQueryResult = await prisma.studentParents.findMany({
        where: {
          student: {
            classroomId: classroomIdQueryRes.classroomId,
          },
        },
        select: {
          parent: {
            select: {
              user: {
                select: {
                  account: {
                    select: {
                      id: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      await globalNotificationService.create({
        input: {
          schoolId,
          sourceId: schedule.id,
          type: {
            type: NotificationType.GROUP,
            accountIds: parentIdQueryResult.map((x) => x.parent.user.account.id),
          },
          title: examScheduleNotification.title(),
          content: examScheduleNotification.content({ examNames }),
          sourceType: NotificationSourceType.EXAM_SCHEDULE,
        },
      });
    } catch (error) {
      logger.error(error, 'Failed to send notification from examSchedule');
    }
  };

  // ? Spaghetti ( this one is a new low ..)
  update = async (params: { schoolId: string; input: UpdateExamScheduleRequest }) => {
    const { schoolId, input } = params;
    const schedule = await prisma.examSchedule.update({
      where: {
        schoolId_examId_assignementId: {
          schoolId: schoolId,
          examId: input.examId,
          assignementId: input.assignmentId,
        },
      },
      data: {
        day: params.input?.date?.day ? parseCalendarDate(params.input.date.day) : null,
        startTime: params.input?.date?.startTime ? parseTime(params.input.date.startTime) : null,
        endTime: params.input?.date?.endTime ? parseTime(params.input.date.endTime) : null,
      },
    });

    try {
      const exam = await prisma.exam.findUnique({
        where: {
          id: input.examId,
        },
        select: {
          name_en: true,
          name_ar: true,
          name_fr: true,
        },
      });
      const examNames = exam
        ? {
            en: exam.name_en,
            ar: exam.name_ar,
            fr: exam.name_fr,
          }
        : undefined;

      const classroomIdQueryRes = await prisma.assignment.findUnique({
        where: {
          id: input.assignmentId,
        },
        select: {
          classroomId: true,
        },
      });
      if (!classroomIdQueryRes) throw new Error('ClassroomId not found ');

      const parentIdQueryResult = await prisma.studentParents.findMany({
        where: {
          student: {
            classroomId: classroomIdQueryRes.classroomId,
          },
        },
        select: {
          parent: {
            select: {
              user: {
                select: {
                  account: {
                    select: {
                      id: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      await globalNotificationService.create({
        input: {
          schoolId,
          sourceId: schedule.id,
          type: {
            type: NotificationType.GROUP,
            accountIds: parentIdQueryResult.map((x) => x.parent.user.account.id),
          },
          title: examScheduleNotification.title(),
          content: examScheduleNotification.content({ examNames }),
          sourceType: NotificationSourceType.EXAM_SCHEDULE,
        },
      });
    } catch (error) {
      logger.error(error, 'Failed to send notification from examSchedule');
    }
  };

  resetAll = async (params: { schoolId: string }) => {
    await prisma.examSchedule.deleteMany({
      where: {
        schoolId: params.schoolId,
      },
    });
  };

  findByClassroom = async (params: { schoolId: string; classroomId: string }) => {
    const examSchedules = await prisma.examSchedule.findMany({
      where: {
        assignement: {
          schoolId: params.schoolId,
          classroomId: params.classroomId,
        },
      },
      include: {
        exam: true,
      },
      orderBy: [
        {
          day: {
            sort: 'asc',
            nulls: 'last',
          },
        },
        {
          startTime: 'asc',
        },
      ],
    });

    const response = examSchedules.map(ExamScheduleMapper.examScheduleResponse);

    return response;
  };
}
