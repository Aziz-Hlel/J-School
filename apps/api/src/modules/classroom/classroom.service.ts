import { prisma } from '@/bootstrap/db.init';
import { RepoKnownErrors } from '@/err/repo/DbError';
import { PrismaErrorCode } from '@/err/repo/PrismaErrorCode';
import { ConflictError, NotFoundError } from '@/err/service/customErrors';
import { ClassGrade } from '@repo/db/prisma/enums';
import { TX } from '@/types/prisma/PrismaTransaction';
import { CreateClassroomRequest } from '@repo/contracts/schemas/classroom/createClassRequest';
import { UpdateClassroomRequest } from '@repo/contracts/schemas/classroom/updateClassRequest';
import { ClassroomMapper } from './classroom.mapper';
import { ClassroomRepo } from './classroom.repo';
import { Prisma } from '@repo/db/prisma/client';
import { ClassroomsQueryParamsTypes } from '@repo/contracts/schemas/classroom/getClassroomsQueryParams';
import { Page } from '@repo/contracts/schemas/page/Page';
import { ClassroomResponse } from '@repo/contracts/schemas/classroom/classResponse';
import { PageMapper } from '@/helper/page.mapper';

export class ClassroomService {
  constructor(private readonly classesRepo: ClassroomRepo) {}

  createAssignmentsForClass = async (params: { classId: string; grade: ClassGrade; schoolId: string }, tx: TX) => {
    const { classId, grade, schoolId } = params;
    const subjects = await tx.subject.findMany({ where: { schoolId, grade }, select: { id: true } });

    const assignmentParams = subjects.map(({ id }) => ({
      subjectId: id,
      classroomId: classId,
      schoolId: schoolId,
      teacherId: null,
    }));

    await tx.assignment.createMany({ data: assignmentParams });
  };

  create = async (params: { input: CreateClassroomRequest; schoolId: string }) => {
    const { input, schoolId } = params;
    try {
      return await prisma.$transaction(async (tx) => {
        let createdClass;
        createdClass = await this.classesRepo.create({ input, schoolId }, tx);
        await this.createAssignmentsForClass({ classId: createdClass.id, grade: input.grade, schoolId }, tx);
        const classResponse = ClassroomMapper.toResponse(createdClass);
        return classResponse;
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === PrismaErrorCode.UNIQUE_CONSTRAINT)
        throw new ConflictError({ message: 'Class already exists', cause: error });
      throw error;
    }
  };

  update = async (params: { input: UpdateClassroomRequest; classroomId: string; schoolId: string }) => {
    const { input, classroomId, schoolId } = params;
    try {
      const updatedClass = await this.classesRepo.update({ input, classroomId, schoolId });
      const classResponse = ClassroomMapper.toResponse(updatedClass);
      return classResponse;
    } catch (error) {
      if (error instanceof RepoKnownErrors.ConflictError)
        throw new ConflictError({ message: 'Class already exists', cause: error });
      if (error instanceof RepoKnownErrors.NotFoundError)
        throw new NotFoundError({ message: 'Class not found', cause: error });
      throw error;
    }
  };

  findById = async (params: { classroomId: string; schoolId: string }) => {
    const { classroomId, schoolId } = params;
    try {
      const classUnit = await this.classesRepo.find({ classroomId, schoolId });
      if (!classUnit) {
        throw new NotFoundError('Class not found');
      }
      const classResponse = ClassroomMapper.toResponse(classUnit);
      return classResponse;
    } catch (error) {
      if (error instanceof RepoKnownErrors.NotFoundError)
        throw new NotFoundError({ message: 'Class not found', cause: error });
      throw error;
    }
  };

  findAll = async (params: {
    schoolId: string;
    query: ClassroomsQueryParamsTypes['Query'];
  }): Promise<Page<ClassroomResponse>> => {
    const { query, schoolId } = params;

    const skip = (query.page - 1) * query.size;
    const take = query.size;

    const where: Prisma.ClassroomWhereInput = {};

    if (query.search && query.search.trim().length > 0) {
      const searchValue = query.search.trim().toLowerCase();
      where.name = { contains: searchValue, mode: 'insensitive' };
    }

    const orderBy: Prisma.ClassroomOrderByWithRelationInput = {};

    if (query.sortBy) {
      orderBy[query.sortBy] = query.order;
    }
    const classrooms = await this.classesRepo.findAll({
      schoolId,
      skip,
      take,
      where,
      orderBy,
    });
    const classroomResponses = classrooms.content.map(ClassroomMapper.toResponse);
    const pageResponse = PageMapper.toPage({
      pagination: query,
      totalElements: classrooms.totalElements,
      data: classroomResponses,
    });
    return pageResponse;
  };
}
