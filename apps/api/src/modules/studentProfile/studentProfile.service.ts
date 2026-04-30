import { RepoKnownErrors } from '@/err/repo/DbError';
import { ConflictError, NotFoundError } from '@/err/service/customErrors';
import { TX } from '@/types/prisma/PrismaTransaction';
import { CreateStudentProfileRequest } from '@repo/contracts/schemas/studentProfile/createStudentProfileRequest';
import { StudentProfileRepo } from './studentProfile.repo';
import { StudentProfileMapper } from './studentProfile.mapper';
import { UpdateStudentProfileRequest } from '@repo/contracts/schemas/studentProfile/updateStudentProfileRequest';

export class StudentProfileService {
  constructor(private readonly studentProfileRepo: StudentProfileRepo) {}

  create = async (params: { input: CreateStudentProfileRequest; studentId: string; schoolId: string }, tx?: TX) => {
    const { input, studentId, schoolId } = params;
    try {
      const createdStudentProfile = await this.studentProfileRepo.create({ input, studentId, schoolId }, tx);
      const studentProfileResponse = StudentProfileMapper.toResponse(createdStudentProfile);
      return studentProfileResponse;
    } catch (error) {
      if (error instanceof RepoKnownErrors.ConflictError) {
        throw new ConflictError({ message: 'Student profile already exists', cause: error });
      }
      if (error instanceof RepoKnownErrors.NotFoundError) {
        throw new NotFoundError({
          message: 'Failed to create student profile',
          cause: error,
          internalLog: `Where student id = ${studentId} and school id = ${schoolId} is not found`,
        });
      }
      throw error;
    }
  };

  update = async (params: { input: UpdateStudentProfileRequest; studentId: string; schoolId: string }, tx?: TX) => {
    const { input, studentId, schoolId } = params;
    try {
      const updatedStudentProfile = await this.studentProfileRepo.update({ input, studentId, schoolId }, tx);
      const studentProfileResponse = StudentProfileMapper.toResponse(updatedStudentProfile);
      return studentProfileResponse;
    } catch (error) {
      if (error instanceof RepoKnownErrors.NotFoundError) {
        throw new NotFoundError({
          message: 'Failed to update student profile',
          cause: error,
          internalLog: `Where student id = ${studentId} and school id = ${schoolId} is not found`,
        });
      }
      throw error;
    }
  };

  getById = async (params: { studentId: string; schoolId: string }, tx?: TX) => {
    const { studentId, schoolId } = params;
    try {
      const studentProfile = await this.studentProfileRepo.getByIdAndSchoolId({ studentId, schoolId }, tx);
      if (!studentProfile) throw new NotFoundError('Student profile not found');
      const studentProfileResponse = StudentProfileMapper.toResponse(studentProfile);
      return studentProfileResponse;
    } catch (error) {
      if (error instanceof RepoKnownErrors.NotFoundError) {
        throw new NotFoundError({
          message: 'Failed to get student profile',
          cause: error,
          internalLog: `Where student id = ${studentId} and school id = ${schoolId} is not found`,
        });
      }
      throw error;
    }
  };
}
