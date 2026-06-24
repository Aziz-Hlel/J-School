import { NotFoundError } from '@/err/service/customErrors';
import { PageMapper } from '@/helper/page.mapper';
import { parseCalendarDate } from '@/utils/dayjs';
import { CreateHomeworkReq } from '@repo/contracts/schemas/Homework/create';
import { HomeworkQueryParamsTypes } from '@repo/contracts/schemas/Homework/queryParam';
import { UpdateHomeworkReq } from '@repo/contracts/schemas/Homework/update';
import prisma from '@repo/db';
import { Prisma } from '@repo/db/prisma/browser';
import { HomeworkMapper } from './homework.mapper';

export class HomeworkService {
  constructor() {}

  async create(data: CreateHomeworkReq, schoolId: string) {
    return prisma.$transaction(
      data.details.map((detail) =>
        prisma.homework.create({
          data: {
            title: data.title,
            content: data.content,

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
              connect: data.files.map((id) => ({
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
        }),
      ),
    );
  }

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

  find = async (params: { schoolId: string; query: HomeworkQueryParamsTypes['Query'] }) => {
    const { schoolId, query } = params;

    const skip = (query.page - 1) * query.size;
    const take = query.size;

    const where: Prisma.HomeworkWhereInput = {
      schoolId: schoolId,
    };

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
