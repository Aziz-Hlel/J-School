import { CreateHomeworkReq } from '@repo/contracts/schemas/Homework/create';
import { UpdateHomeworkReq } from '@repo/contracts/schemas/Homework/update';
import prisma from '@repo/db';
import { HomeworkMapper } from './homework.mapper';
import { NotFoundError } from '@/err/service/customErrors';

export class HomeworkService {
  constructor() {}

  create = async (params: { schoolId: string; input: CreateHomeworkReq }) => {
    const { schoolId, input } = params;
    const homework = await prisma.homework.create({
      data: {
        title: input.title,
        content: input.content,
        files: {
          connect: input.files.map((id) => ({
            id,
          })),
        },
        due: input.due,
        assignmentId: input.assignmentId,
        schoolId: schoolId,
        studentHomeworks: {
          create: input.studentIds.map((studentId) => ({
            studentId: studentId,
          })),
        },
      },
    });
    return homework;
  };

  update = async (params: { schoolId: string; id: string; input: UpdateHomeworkReq }) => {
    const { schoolId, id, input } = params;
    const homework = await prisma.homework.update({
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
      },
    });
    return homework;
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

  find = async (params: { schoolId: string }) => {
    const { schoolId } = params;
    const homeworks = await prisma.homework.findMany({
      where: {
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
    const result = homeworks.map((homework) => HomeworkMapper.toResponse(homework));
    return result;
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
