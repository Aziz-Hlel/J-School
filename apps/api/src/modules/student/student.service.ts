import { ConflictError, NotFoundError } from '@/err/service/customErrors';
import { RepoKnownErrors } from '@/err/repo/DbError';
import { CreateStudentWithProfileRequest } from '@repo/contracts/schemas/student/createStudentWithProfile';
import { StudentRepo } from './student.repo';
import { UpdateStudentWithProfileRequest } from '@repo/contracts/schemas/student/updateStudentWithProfileRequest';
import { TX } from '@/types/prisma/PrismaTransaction';
import { CreateStudentRequest } from '@repo/contracts/schemas/student/createStudentRequest';
import { UpdateStudentRequest } from '@repo/contracts/schemas/student/updateStudentRequest';
import { StudentStatus } from '@repo/db/prisma/enums';
import { StudentMapper } from './student.mapper';
import prisma from '@repo/db';
import { ExtraCurricularMapper } from '../ExtraCurricular/ExtraCurricular.mapper';
import { Page } from '@repo/contracts/schemas/page/Page';
import { StudentResponse } from '@repo/contracts/schemas/student/studentResponse';
import { StudentsQueryParamsTypes } from '@repo/contracts/schemas/student/getStudentsQueryParams';
import { Prisma } from '@repo/db/prisma/client';
import { PageMapper } from '@/helper/page.mapper';

export class StudentService {
  constructor(private readonly studentRepo: StudentRepo) {}

  create = async (params: { input: CreateStudentRequest; schoolId: string }, tx?: TX) => {
    const { input, schoolId } = params;
    try {
      const createdStudent = await this.studentRepo.create({ input, schoolId }, tx);
      const studentResponse = StudentMapper.toResponse(createdStudent);
      return studentResponse;
    } catch (error) {
      if (error instanceof RepoKnownErrors.ConflictError) {
        throw new ConflictError({ message: 'Student already exists', cause: error });
      }
      if (error instanceof RepoKnownErrors.NotFoundError) {
        throw new NotFoundError({ message: 'Failed to create student', cause: error });
      }
      throw error;
    }
  };

  update = async (
    params: { input: UpdateStudentRequest & { status: StudentStatus }; studentId: string; schoolId: string },
    tx?: TX,
  ) => {
    const { input, schoolId, studentId } = params;
    try {
      const updatedStudent = await this.studentRepo.update({ input, schoolId, studentId }, tx);
      const studentResponse = StudentMapper.toResponse(updatedStudent);
      return studentResponse;
    } catch (error) {
      if (error instanceof RepoKnownErrors.ConflictError) {
        throw new ConflictError({ message: 'Student already exists', cause: error });
      }
      if (error instanceof RepoKnownErrors.NotFoundError) {
        throw new NotFoundError({ message: 'Student not found', cause: error });
      }
      throw error;
    }
  };

  createWithProfile = async (params: { input: CreateStudentWithProfileRequest; schoolId: string }, tx?: TX) => {
    const { input, schoolId } = params;
    try {
      const createdStudent = await this.studentRepo.createWithProfile({ input, schoolId }, tx);
      const studentResponse = StudentMapper.toResponse(createdStudent);
      return studentResponse;
    } catch (error) {
      if (error instanceof RepoKnownErrors.ConflictError) {
        throw new ConflictError({ message: 'Student already exists', cause: error });
      }
      if (error instanceof RepoKnownErrors.NotFoundError) {
        throw new NotFoundError({ message: 'Failed to create student', cause: error });
      }
      throw error;
    }
  };

  updateWithProfile = async (
    params: { input: UpdateStudentWithProfileRequest; schoolId: string; studentId: string },
    tx?: TX,
  ) => {
    const { input, schoolId, studentId } = params;
    try {
      const updatedStudent = await this.studentRepo.updateWithProfile({ input, schoolId, studentId }, tx);
      const studentResponse = StudentMapper.toResponse(updatedStudent);
      return studentResponse;
    } catch (error) {
      if (error instanceof RepoKnownErrors.ConflictError) {
        throw new ConflictError({ message: 'Student already exists', cause: error });
      }
      if (error instanceof RepoKnownErrors.NotFoundError) {
        throw new NotFoundError({ message: 'Student not found', cause: error });
      }
      throw error;
    }
  };

  findById = async (params: { schoolId: string; studentId: string }, tx?: TX) => {
    const { schoolId, studentId } = params;
    try {
      const student = await this.studentRepo.findById({ schoolId, studentId }, tx);
      if (!student) {
        throw new NotFoundError({ message: 'Student not found' });
      }
      const studentResponse = StudentMapper.toResponse(student);
      return studentResponse;
    } catch (error) {
      if (error instanceof RepoKnownErrors.NotFoundError) {
        throw new NotFoundError({ message: 'Student not found', cause: error });
      }
      throw error;
    }
  };

  getExtraCurricular = async (params: { schoolId: string; studentId: string }) => {
    const { schoolId, studentId } = params;

    const queryResult = await prisma.studentExtraCurricular.findMany({
      where: {
        studentId,
        schoolId,
      },
      include: {
        extraCurricular: { include: { title: true, session: true, teacher: { include: { user: true } } } },
      },
    });

    const result = queryResult.map((item) => ExtraCurricularMapper.toResponse(item.extraCurricular));
    return result;
  };

  findAll = async (params: {
    schoolId: string;
    query: StudentsQueryParamsTypes['Query'];
  }): Promise<Page<StudentResponse>> => {
    const { query, schoolId } = params;

    const skip = (query.page - 1) * query.size;
    const take = query.size;

    const where: Prisma.StudentWhereInput = {
      schoolId,
    };

    if (query.search && query.search.trim().length > 0) {
      const searchValue = query.search.trim();
      where.OR = [
        { firstName_en: { contains: searchValue, mode: 'insensitive' } },
        { lastName_en: { contains: searchValue, mode: 'insensitive' } },
        { firstName_ar: { contains: searchValue, mode: 'insensitive' } },
        { lastName_ar: { contains: searchValue, mode: 'insensitive' } },
      ];
    }

    const orderBy: Prisma.StudentOrderByWithRelationInput = {};

    if (query.sortBy === 'firstName') {
      orderBy.firstName_en = query.order;
    } else if (query.sortBy === 'lastName') {
      orderBy.lastName_en = query.order;
    } else {
      orderBy.createdAt = query.order;
    }

    const students = prisma.student.findMany({
      skip,
      take,
      where,
      orderBy,
      include: {
        avatar: true,
      },
    });

    const studentsCount = prisma.student.count({ where });

    const [content, totalElements] = await Promise.all([students, studentsCount]);

    const studentResponses = content.map(StudentMapper.toResponse);
    const pageResponse = PageMapper.toPage({
      pagination: query,
      totalElements,
      data: studentResponses,
    });
    return pageResponse;
  };
}
