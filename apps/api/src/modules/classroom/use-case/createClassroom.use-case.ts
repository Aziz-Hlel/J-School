import { AssignmentInternal } from '@/modules/assignment/assignment.internal';
import { BadRequestError, ConflictError } from '@/err/service/customErrors';
import { prisma } from '@/bootstrap/db.init';
import { CreateClassroomRequest } from '@repo/contracts/schemas/classroom/createClassRequest';
import { PrismaErrorCode } from '@/err/repo/PrismaErrorCode';
import { ClassroomMapper } from '../classroom.mapper';
import { ClassroomRepo } from '../classroom.repo';
import { SubjectInternal } from '@/modules/subject/subject.internal';
import { Prisma } from '@repo/db/prisma/client';

export class CreateClassroomUseCase {
  constructor(
    private readonly classroomRepo: ClassroomRepo,
    private readonly subjectInternal: SubjectInternal,
    private readonly assignmentInternal: AssignmentInternal,
  ) {}

  execute = async (params: { input: CreateClassroomRequest; schoolId: string }) => {
    const { input, schoolId } = params;
    return await prisma.$transaction(async (tx) => {
      let createdClass;
      try {
        createdClass = await this.classroomRepo.create({ input, schoolId }, tx);
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === PrismaErrorCode.UNIQUE_CONSTRAINT)
          throw new ConflictError({
            message: 'Class already exists',
            clientMessage: `Class with the name ${input.name} already exists in grade ${input.grade}.`,
            cause: error,
          });
        throw error;
      }
      const subjects = await this.subjectInternal.findByGrade({ schoolId, grade: input.grade });
      if (subjects.length === 0)
        throw new BadRequestError({
          message: 'No subjects found for the given grade',
          clientMessage: 'No subjects found for the given grade, please add subjects before creating a class.',
        });
      const subjectIds = subjects.map((s) => s.id);
      try {
        await this.assignmentInternal.createMany({ schoolId, classroomId: createdClass.id, subjectIds }, tx);
      } catch (error) {
        throw new BadRequestError({
          message: 'Failed to create class',
          cause: error,
          internalLog: 'Failed to create assignments',
        });
      }
      const classResponse = ClassroomMapper.toResponse(createdClass);
      return classResponse;
    });
  };
}
