import { TX } from '@/types/prisma/PrismaTransaction';
import { AssignmentRepo } from './assignment.repo';
import { prisma } from '@/bootstrap/db.init';
import { Prisma } from '@repo/db/prisma/client';
import { PrismaErrorCode } from '@/err/repo/PrismaErrorCode';
import { AssignTeacherRequestInput } from '@repo/contracts/schemas/assignment/assignTeacherRequest';
import { NotFoundError } from '@/err/service/customErrors';
import { AssignemntMapper } from './assignment.mapper';

export class AssignmentService {
  constructor(private readonly repo: AssignmentRepo) {}

  /** @deprecated */
  syncMany = async (
    params: {
      input: { subjectId: string; teacherId: string | null }[];
      schoolId: string;
      classroomId: string;
    },
    tx?: TX,
  ) => {
    const { input, schoolId, classroomId } = params;
    const client = tx ?? prisma;
    let successCount = 0;
    let failedCount = 0;
    const failedAssignments: {
      assignment: { schoolId: string; classroomId: string; subjectId: string; teacherId: string | null };
      index: number;
      reason: 'CONFLICT' | 'OTHER';
    }[] = [];
    try {
      const bulkOperations = input.map(async (item, index) => {
        const assignment = {
          schoolId,
          classroomId,
          subjectId: item.subjectId,
          teacherId: item.teacherId,
        };
        try {
          await this.repo.upsert(assignment, client);
          successCount++;
        } catch (error) {
          if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === PrismaErrorCode.UNIQUE_CONSTRAINT) {
              failedAssignments.push({ assignment, index, reason: 'CONFLICT' });
              failedCount++;
              return;
            }
          }
          failedAssignments.push({ assignment, index, reason: 'OTHER' });
          failedCount++;
        }
      });
      await Promise.all(bulkOperations);
      return {
        successCount,
        failedCount,
        failedAssignments,
      };
    } catch (error) {
      throw error;
    }
  };

  assignTeacher = async (
    params: { schoolId: string; assignmentId: string; input: AssignTeacherRequestInput },
    tx?: TX,
  ) => {
    const { schoolId, assignmentId, input } = params;
    const teacherId = input.teacherId;
    const client = tx ?? prisma;
    try {
      const assignment = await this.repo.updateTeacher({ schoolId, assignmentId, teacherId }, client);
      return assignment;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === PrismaErrorCode.NOT_FOUND) {
        throw new NotFoundError({
          message: 'Failed to assign teacher',
          clientMessage: 'Failed to assign teacher',
          internalLog: `Assignment with id ${assignmentId} or teacher with id ${teacherId} could not be found`,
          cause: error,
        });
      }
      throw error;
    }
  };

  getClassroomTimeTable = async (params: { schoolId: string; classroomId: string }, tx?: TX) => {
    const { schoolId, classroomId } = params;
    const client = tx ?? prisma;
    const classroom = await client.assignment.findMany({
      where: {
        schoolId,
        classroomId,
      },
      select: {
        subject: { select: { id: true, name_en: true, name_fr: true, name_ar: true } },
        teacher: { select: { id: true, user: { select: { firstName: true, lastName: true, gender: true } } } },
        timetable: {
          select: { day: true, startTime: true, endTime: true },
          orderBy: { startTime: 'asc' },
        },
      },
    });

    const timeTableResponse = AssignemntMapper.toClassroomTimeTable(classroom);
    return timeTableResponse;
  };
}
