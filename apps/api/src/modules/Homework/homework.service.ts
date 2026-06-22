import { NotFoundError } from '@/err/service/customErrors';
import { PageMapper } from '@/helper/page.mapper';
import { CreateHomeworkReq } from '@repo/contracts/schemas/Homework/create';
import { HomeworkQueryParamsTypes } from '@repo/contracts/schemas/Homework/queryParam';
import { UpdateHomeworkReq } from '@repo/contracts/schemas/Homework/update';
import prisma from '@repo/db';
import { Prisma } from '@repo/db/prisma/browser';
import { HomeworkMapper } from './homework.mapper';

export class HomeworkService {
  constructor() {}

  create = async (params: { schoolId: string; input: CreateHomeworkReq }) => {
    const { schoolId, input } = params;
    // const homework = await prisma.homework.create({
    //   data: {
    //     title: input.title,
    //     content: input.content,
    //     files: {
    //       connect: input.files.map((id) => ({
    //         id,
    //       })),
    //     },
    //     due: input.due,
    //     assignmentId: input.assignmentId,
    //     schoolId: schoolId,
    //     studentHomeworks: {
    //       create: input.studentIds.map((studentId) => ({
    //         studentId: studentId,
    //       })),
    //     },
    //   },
    // });

    const homework = await prisma.homework.createMany({
      data: input.details.map((detail) => ({
        title: input.title,
        content: input.content,
        files: {
          connect: input.files.map((id) => ({
            id,
          })),
        },
        due: detail.due,
        assignmentId: detail.assignmentId,
        schoolId: schoolId,
        studentHomeworks: {
          create: detail.studentIds.map((studentId) => ({
            studentId: studentId,
          })),
        },
      })),
    });
    return homework;
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
          due: input.due,
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
