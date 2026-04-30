import { ConflictError, NotFoundError } from '@/err/service/customErrors';
import { TX } from '@/types/prisma/PrismaTransaction';
import { UpdateTeacherRequest } from '@repo/contracts/schemas/teacher/updateTeacherRequest';
import { UserService } from '../User/user.service';
import { TeacherMapper } from './teacher.mapper';
import { TeacherRepo } from './teacher.repo';
import { TeacherResponse } from '@repo/contracts/schemas/teacher/teacherResponse';
import { Page } from '@repo/contracts/schemas/page/Page';
import { Prisma } from '@repo/db/prisma/client';
import { PageMapper } from '@/helper/page.mapper';
import type { TeacherQueryParamsTypes } from '@repo/contracts/schemas/teacher/teacherQueryParams';

export class TeacherService {
  constructor(
    private readonly teacherRepo: TeacherRepo,
    private readonly userService: UserService,
  ) {}

  create = async ({ userId }: { userId: string }, tx?: TX) => {
    const existingTeacher = await this.teacherRepo.findByUserId({ userId });
    if (existingTeacher) {
      throw new ConflictError({
        message: 'Teacher already exists',
        internalLog: `Teacher with userId ${userId} already exists`,
      });
    }
    const createdTeacher = await this.teacherRepo.create({ userId }, tx);

    return createdTeacher;
  };

  findByUserId = async ({ userId }: { userId: string }) => {
    const teacher = await this.teacherRepo.findByUserId(
      { userId },
      { include: { user: { include: { account: { include: { avatar: true } } } } } },
    );
    if (!teacher) {
      throw new NotFoundError('Teacher not found');
    }

    const teacherResponse = TeacherMapper.toResponse(teacher);
    return teacherResponse;
  };

  getById = async (teacherId: string, schoolId: string) => {
    const teacher = await this.teacherRepo.findById(
      { id: teacherId },
      { include: { user: { include: { account: { include: { avatar: true } } } } } },
    );
    if (!teacher) {
      throw new NotFoundError('Teacher not found');
    }
    if (teacher.user.schoolId !== schoolId) {
      throw new NotFoundError('Teacher not found');
    }

    const teacherResponse = TeacherMapper.toResponse(teacher);
    return teacherResponse;
  };

  update = async ({
    input,
    teacherId,
    schoolId,
  }: {
    input: UpdateTeacherRequest;
    teacherId: string;
    schoolId: string;
  }) => {
    const existingTeacher = await this.teacherRepo.findById(
      { id: teacherId },
      { include: { user: { select: { id: true, schoolId: true } } } },
    );

    if (!existingTeacher) {
      throw new NotFoundError('Teacher not found');
    }
    if (existingTeacher.user.schoolId !== schoolId) {
      throw new NotFoundError({
        message: 'Teacher not found',
        internalLog: `Teacher with id ${teacherId} exists but not in school ${schoolId}`,
      });
    }

    const updatedUser = await this.userService.updateSimpleUser({
      input,
      userId: existingTeacher.user.id,
      schoolId,
    }); // ? All Teacher fields to be updated are in user table
    return {
      id: existingTeacher.id,
      user: updatedUser,
    };
  };

  findAll = async (params: {
    schoolId: string;
    query: TeacherQueryParamsTypes['Query'];
  }): Promise<Page<TeacherResponse>> => {
    const { query, schoolId } = params;

    const skip = (query.page - 1) * query.size;
    const take = query.size;

    const where: Prisma.TeacherWhereInput = {};

    if (query.search && query.search.trim().length > 0) {
      const searchValue = query.search.trim().toLowerCase();
      where.user = {
        is: {
          OR: [
            { firstName: { contains: searchValue, mode: 'insensitive' } },
            { lastName: { contains: searchValue, mode: 'insensitive' } },
          ],
        },
      };
    }

    const orderBy: Prisma.TeacherOrderByWithRelationInput = {};

    if (query.sortBy === 'firstName' || query.sortBy === 'lastName' || query.sortBy === 'gender') {
      orderBy.user = {
        [query.sortBy]: query.order,
      };
    }

    if (query.sortBy === 'createdAt') {
      orderBy[query.sortBy] = query.order;
    }

    const teachers = await this.teacherRepo.findAll(
      {
        schoolId,
        skip,
        take,
        where,
        orderBy,
      },
      { user: { include: { account: { include: { avatar: true } } } } },
    );

    const teacherResponses = teachers.content.map(TeacherMapper.toResponse);

    const pageResponse = PageMapper.toPage({
      pagination: query,
      totalElements: teachers.totalElements,
      data: teacherResponses,
    });

    return pageResponse;
  };
}
