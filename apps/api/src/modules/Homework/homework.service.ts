import { NotFoundError } from '@/err/service/customErrors';
import { PageMapper } from '@/helper/page.mapper';
import { globalOcrQueue } from '@/mq/ocr.queue';
import { homeworkNotification } from '@/template/notification/homework';
import { parseCalendarDate } from '@/utils/dayjs';
import { AdminHomeworkQueryParamsTypes } from '@repo/contracts/schemas/Homework/adminQueryParam';
import { CreateHomeworkReq } from '@repo/contracts/schemas/Homework/create';
import { UpdateHomeworkReq } from '@repo/contracts/schemas/Homework/update';
import prisma from '@repo/db';
import { NotificationSourceType, NotificationType, Prisma } from '@repo/db/prisma/browser';
import { globalNotificationService } from '../Notification/notification.service';
import { HomeworkMapper } from './homework.mapper';

export class HomeworkService {
  constructor() {}

  create = async (params: { input: CreateHomeworkReq; schoolId: string }) => {
    const { input, schoolId } = params;
    return prisma.$transaction(async (tx) => {
      await Promise.all(
        input.details.map(async (detail) => {
          const homework = await tx.homework.create({
            data: {
              title: input.title,
              content: input.content,
              type: input.type,
              due: parseCalendarDate(detail.due),

              school: {
                connect: {
                  id: schoolId,
                },
              },

              assignment: {
                connect: {
                  id: detail.assignmentId,
                },
              },

              files: {
                connect: input.files.map((id) => ({
                  id,
                })),
              },

              studentHomeworks: {
                createMany: {
                  data: detail.studentIds.map((studentId) => ({
                    studentId,
                  })),
                },
              },
            },

            include: {
              files: true,
              studentHomeworks: true,
            },
          });

          globalOcrQueue.add({ payload: { homeworkId: homework.id } });

          try {
            const assigmnt = await prisma.assignment.findUnique({
              where: {
                id: detail.assignmentId,
              },
              select: {
                classroomId: true,
              },
            });
            if (!assigmnt?.classroomId) throw new Error('Classroom not found');
            const parents = await prisma.studentParents.findMany({
              where: {
                student: {
                  classroomId: assigmnt.classroomId,
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

            const subject = await prisma.subject.findUnique({
              where: {
                id: detail.assignmentId,
              },
              select: {
                name_en: true,
                name_ar: true,
                name_fr: true,
              },
            });
            const subjectNames = subject
              ? {
                  en: subject.name_en,
                  ar: subject.name_ar,
                  fr: subject.name_fr,
                }
              : undefined;
            await globalNotificationService.create({
              input: {
                schoolId,
                sourceId: homework.id,
                type: {
                  type: NotificationType.GROUP,
                  accountIds: parents.map((x) => x.parent.user.account.id),
                },
                title: homeworkNotification.title(),
                content: homeworkNotification.content({ subjectNames }),
                sourceType: NotificationSourceType.HOMEWORK,
              },
            });
          } catch (error) {}
        }),
      );
    });
  };

  update = async (params: { schoolId: string; id: string; input: UpdateHomeworkReq }) => {
    const { schoolId, id, input } = params;
    await prisma.$transaction(async (tx) => {
      await tx.studentHomework.deleteMany({
        where: {
          homeworkId: id,
          studentId: {
            notIn: input.studentIds,
          },
        },
      });

      const homework = await tx.homework.update({
        where: {
          id: id,
          schoolId: schoolId,
        },
        data: {
          title: input.title,
          content: input.content,
          files: {
            set: input.files.map((id) => ({
              id,
            })),
          },
          due: parseCalendarDate(input.due),
          assignmentId: input.assignmentId,
          studentHomeworks: {
            createMany: {
              data: input.studentIds.map((studentId) => {
                return {
                  studentId: studentId,
                };
              }),
              skipDuplicates: true,
            },
          },
        },
      });
      return homework;
    });
  };

  delete = async (params: { schoolId: string; id: string }) => {
    const { schoolId, id } = params;
    const homework = await prisma.homework.deleteMany({
      where: {
        id: id,
        schoolId: schoolId,
      },
    });
    return homework;
  };

  find = async (params: { schoolId: string; query: AdminHomeworkQueryParamsTypes['Query'] }) => {
    const { schoolId, query } = params;

    const skip = (query.page - 1) * query.size;
    const take = query.size;

    const where: Prisma.HomeworkWhereInput = {
      schoolId: schoolId,
    };

    if (query.classroomId) {
      where.studentHomeworks = {
        some: {
          ...(query.classroomId && {
            student: {
              classroomId: query.classroomId,
            },
          }),
        },
      };
    }

    if (query.teacherId) {
      where.assignment = {
        teacherId: query.teacherId,
      };
    }

    const orderBy: Prisma.HomeworkOrderByWithRelationInput = {
      due: 'desc',
    };

    const queryResponse = prisma.homework.findMany({
      skip,
      take,
      where,
      orderBy,
      include: {
        files: true,
        assignment: {
          include: {
            classroom: true,
            subject: true,
            teacher: { include: { user: { include: { account: { include: { avatar: true } } } } } },
          },
        },
      },
    });

    const count = prisma.homework.count({
      where,
    });

    const [content, totalElements] = await Promise.all([queryResponse, count]);

    const dataResponse = content.map((homework) => HomeworkMapper.toResponse(homework));

    const pageResponse = PageMapper.toPage({
      data: dataResponse,
      pagination: query,
      totalElements: totalElements,
    });

    return pageResponse;
  };

  findById = async (params: { schoolId: string; id: string }) => {
    const { schoolId, id } = params;
    const homework = await prisma.homework.findUnique({
      where: {
        id: id,
        schoolId: schoolId,
      },
      include: {
        files: true,
        assignment: {
          include: {
            classroom: true,
            subject: true,
            teacher: { include: { user: { include: { account: { include: { avatar: true } } } } } },
          },
        },
      },
    });
    if (!homework) throw new NotFoundError('Homework not found');
    const result = HomeworkMapper.toResponse(homework);
    return result;
  };
}
