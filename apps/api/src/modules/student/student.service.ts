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
}
