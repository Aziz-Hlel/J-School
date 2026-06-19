import { NotFoundError } from '@/err/service/customErrors';
import { PageMapper } from '@/helper/page.mapper';
import { parseTime } from '@/utils/dayjs';
import type { CreateExtraCurricularReq } from '@repo/contracts/schemas/extraCurricular/createExtraCurricularRequest';
import { ExtraCurricularResponse } from '@repo/contracts/schemas/extraCurricular/extraCurricularResponse';
import { ExtraCurricularQueryParamsTypes } from '@repo/contracts/schemas/extraCurricular/findAllQueryParams';
import type { UpdateExtraCurricularReq } from '@repo/contracts/schemas/extraCurricular/updateExtraCurricularReq';
import { Page } from '@repo/contracts/schemas/page/Page';
import prisma from '@repo/db';
import { Prisma } from '@repo/db/prisma/client';
import { SessionType } from '@repo/db/prisma/enums';
import { StudentMapper } from '../student/student.mapper';
import { ExtraCurricularMapper } from './ExtraCurricular.mapper';

export class ExtraCurricularService {
  create = async (params: { input: CreateExtraCurricularReq; schoolId: string }) => {
    const { input, schoolId } = params;

    return await prisma.$transaction(async (tx) => {
      const createdExtraCurricular = await tx.extraCurricular.create({
        data: {
          title: {
            create: {
              en: input.title.en,
              fr: input.title.fr,
              ar: input.title.ar,
            },
          },
          grade: input.grade,
          session: {
            create: {
              type: SessionType.WEEKLY,
              day: input.dayOfWeek,
              startTime: parseTime(input.startTime),
              endTime: parseTime(input.endTime),
            },
          },
          teacherId: input.teacherId,
          schoolId: schoolId,
        },
      });

      return createdExtraCurricular;
    });
  };

  update = async (params: { input: UpdateExtraCurricularReq; schoolId: string; extraCurricularId: string }) => {
    const { input, schoolId, extraCurricularId } = params;
    const extraCurricular = await prisma.extraCurricular.update({
      where: {
        id: extraCurricularId,
        schoolId,
      },
      data: {
        teacher: input.teacherId ? { connect: { id: input.teacherId } } : { disconnect: true },
        title: {
          update: {
            en: input.title.en,
            fr: input.title.fr,
            ar: input.title.ar,
          },
        },
        session: {
          update: {
            day: input.dayOfWeek,
            startTime: input.startTime ? parseTime(input.startTime) : undefined,
            endTime: input.endTime ? parseTime(input.endTime) : undefined,
          },
        },
      },
    });
    return { id: extraCurricular.id };
  };

  delete = async (params: { schoolId: string; extraCurricularId: string }) => {
    const { schoolId, extraCurricularId } = params;
    await prisma.extraCurricular.deleteMany({
      where: {
        id: extraCurricularId,
        schoolId,
      },
    });
    return;
  };

  findAll = async (params: {
    schoolId: string;
    query: ExtraCurricularQueryParamsTypes['Query'];
  }): Promise<Page<ExtraCurricularResponse>> => {
    const { query, schoolId } = params;

    const skip = (query.page - 1) * query.size;
    const take = query.size;

    const where: Prisma.ExtraCurricularWhereInput = {
      schoolId,
    };

    if (query.search && query.search.trim().length > 0) {
      const searchValue = query.search.trim().toLowerCase();
      where.OR = [
        { title: { en: { contains: searchValue, mode: 'insensitive' } } },
        { title: { fr: { contains: searchValue, mode: 'insensitive' } } },
        { title: { ar: { contains: searchValue, mode: 'insensitive' } } },
      ];
    }

    const orderBy: Prisma.ExtraCurricularOrderByWithRelationInput = {};

    if (query.sortBy) {
      orderBy[query.sortBy] = query.order;
    }
    const extraCurriculars = prisma.extraCurricular.findMany({
      skip,
      take,
      where,
      orderBy,
      include: {
        title: true,
        session: true,
        teacher: { include: { user: { include: { account: { include: { avatar: true } } } } } },
      },
    });
    const extraCurricularsCount = prisma.extraCurricular.count({ where });

    const [content, totalElements] = await Promise.all([extraCurriculars, extraCurricularsCount]);

    const extraCurricularResponses = content.map(ExtraCurricularMapper.toResponse);
    const pageResponse = PageMapper.toPage({
      pagination: query,
      totalElements,
      data: extraCurricularResponses,
    });
    return pageResponse;
  };

  findOne = async (params: { schoolId: string; extraCurricularId: string }) => {
    const { schoolId, extraCurricularId } = params;
    const extraCurricular = await prisma.extraCurricular.findUnique({
      where: {
        id: extraCurricularId,
        schoolId,
      },
      include: {
        title: true,
        session: true,
        teacher: { include: { user: { include: { account: { include: { avatar: true } } } } } },
      },
    });
    if (!extraCurricular) {
      throw new NotFoundError('Extra curricular not found');
    }
    const response = ExtraCurricularMapper.toResponse(extraCurricular);
    return response;
  };

  assignToStudent = async (params: { schoolId: string; extraCurricularId: string; studentId: string }) => {
    const { schoolId, extraCurricularId, studentId } = params;
    const extraCurricular = await prisma.studentExtraCurricular.upsert({
      where: {
        studentId_extraCurricularId: {
          studentId,
          extraCurricularId,
        },
      },
      create: {
        studentId,
        extraCurricularId,
        schoolId,
      },
      update: {},
    });
    return extraCurricular;
  };

  unassignFromStudent = async (params: { schoolId: string; extraCurricularId: string; studentId: string }) => {
    const { schoolId, extraCurricularId, studentId } = params;
    const extraCurricular = await prisma.studentExtraCurricular.deleteMany({
      where: {
        studentId,
        extraCurricularId,
        schoolId,
      },
    });
    return extraCurricular;
  };

  getStudents = async (params: { schoolId: string; extraCurricularId: string }) => {
    const { schoolId, extraCurricularId } = params;
    const queryResult = await prisma.studentExtraCurricular.findMany({
      where: {
        schoolId,
        extraCurricularId,
      },
      include: {
        student: { include: { avatar: true, classroom: true } },
      },
    });
    const response = queryResult.map((s) => StudentMapper.toResponseWithClassroom(s.student));
    return response;
  };
}
