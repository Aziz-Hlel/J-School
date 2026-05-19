import { CreateTeacherCommentsReq } from '@repo/contracts/schemas/TeacherComments/create';
import { UpdateTeacherCommentsReq } from '@repo/contracts/schemas/TeacherComments/update';
import prisma from '@repo/db';
import { TeacherCommentsMapper } from './teacherComments.mapper';
import { ConflictError, NotFoundError } from '@/err/service/customErrors';
import { Prisma } from '@repo/db/prisma/client';
import type { TeacherCommentsQueryParamsTypes } from '@repo/contracts/schemas/TeacherComments/queryParams';
import { PageMapper } from '@/helper/page.mapper';
import { ReplyToCommentReq } from '@repo/contracts/schemas/TeacherComments/replyToComment';

export class TeacherCommentsService {
  constructor() {}

  create = async (params: { input: CreateTeacherCommentsReq; teacherId: string; schoolId: string }) => {
    const { schoolId, teacherId, input } = params;
    const result = await prisma.teacherComment.create({
      data: {
        ...input,
        teacherId,
        schoolId,
      },
    });
    return result;
  };

  update = async (params: { input: UpdateTeacherCommentsReq; id: string }) => {
    const { id, input } = params;
    const result = await prisma.teacherComment.update({
      where: {
        id,
      },
      data: {
        ...input,
      },
    });
    return result;
  };

  replyTeacherComment = async (params: { id: string; schoolId: string; input: ReplyToCommentReq }) => {
    const { schoolId, id, input } = params;
    const result = await prisma.teacherComment.findUnique({
      where: {
        id,
        schoolId,
      },
    });
    if (!result) throw new NotFoundError('TeacherComment not found');
    if (result.parentReply) throw new ConflictError('Parent already replied');
    if (!result.canParentReply) throw new ConflictError('Parent can not reply to this comment');
    await prisma.teacherComment.update({
      where: {
        id,
        schoolId,
      },
      data: {
        parentReply: input.reply,
        canParentReply: false,
      },
    });
  };

  delete = async (params: { id: string }) => {
    const { id } = params;
    await prisma.teacherComment
      .delete({
        where: {
          id,
        },
      })
      .catch(null);
  };

  find = async (params: { id: string; schoolId: string }) => {
    const { id, schoolId } = params;
    const result = await prisma.teacherComment.findUnique({
      where: {
        id,
        schoolId,
      },
      include: {
        student: true,
        teacher: {
          include: {
            user: { select: { account: { select: { avatar: true } }, firstName: true, lastName: true, id: true } },
          },
        },
      },
    });
    if (!result) throw new NotFoundError('TeacherComment not found');

    const response = TeacherCommentsMapper.toResponse(result);
    return response;
  };

  findAll = async (params: {
    query: TeacherCommentsQueryParamsTypes['Query'];
    schoolId: string;
    studentId?: string;
    teacherId?: string;
  }) => {
    const { query, schoolId, studentId, teacherId } = params;

    const skip = (query.page - 1) * query.size;
    const take = query.size;

    const where: Prisma.TeacherCommentWhereInput = {
      schoolId,
      studentId,
      teacherId,
    };

    const orderBy: Prisma.TeacherCommentOrderByWithRelationInput = {};

    if (query.sortBy) {
      orderBy[query.sortBy] = query.order;
    }

    const queryResponse = prisma.teacherComment.findMany({
      skip,
      take,
      where,
      orderBy,
      include: {
        student: true,
        teacher: {
          include: {
            user: { select: { account: { select: { avatar: true } }, firstName: true, lastName: true, id: true } },
          },
        },
      },
    });

    const count = prisma.teacherComment.count({ where });

    const [content, totalElements] = await Promise.all([queryResponse, count]);

    const dataResponse = content.map(TeacherCommentsMapper.toResponse);

    const pageResponse = PageMapper.toPage({
      data: dataResponse,
      pagination: query,
      totalElements: totalElements,
    });

    return pageResponse;
  };
}
