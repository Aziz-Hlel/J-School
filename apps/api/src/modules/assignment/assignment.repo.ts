import { prisma } from '@/bootstrap/db.init';
import { RepoError_V2 } from '@/err/repo/DbError.v2';
import type { TX } from '@/types/prisma/PrismaTransaction';

export class AssignmentRepo {
  create = async (params: { schoolId: string; classroomId: string; subjectId: string }, tx?: TX) => {
    const { schoolId, classroomId, subjectId } = params;
    const client = tx ?? prisma;
    try {
      const syncedAssignment = await client.assignment.create({
        data: {
          schoolId,
          classroomId,
          subjectId,
        },
      });
      return syncedAssignment;
    } catch (error) {
      throw RepoError_V2.handleRepoError(error);
    }
  };

  createMany = async (params: { schoolId: string; classroomId: string; subjectId: string }[], tx?: TX) => {
    const client = tx ?? prisma;
    try {
      const createdAssignments = await client.assignment.createMany({
        data: params,
      });
      return createdAssignments;
    } catch (error) {
      throw RepoError_V2.handleRepoError(error);
    }
  };

  upsert = async (
    params: { schoolId: string; classroomId: string; subjectId: string; teacherId: string | null },
    tx?: TX,
  ) => {
    const { schoolId, classroomId, subjectId, teacherId } = params;
    const client = tx ?? prisma;
    try {
      const syncedAssignment = await client.assignment.upsert({
        where: {
          schoolId_classroomId_subjectId: {
            schoolId,
            classroomId,
            subjectId,
          },
        },
        update: {
          teacherId: teacherId,
        },
        create: {
          schoolId,
          classroomId,
          subjectId,
          teacherId: teacherId,
        },
      });
      return syncedAssignment;
    } catch (error) {
      throw RepoError_V2.handleRepoError(error);
    }
  };

  updateTeacher = async (params: { schoolId: string; assignmentId: string; teacherId: string | null }, tx?: TX) => {
    const { schoolId, assignmentId, teacherId } = params;
    const client = tx ?? prisma;
    try {
      const updatedAssignment = await client.assignment.update({
        where: {
          id: assignmentId,
          schoolId,
        },
        data: {
          teacherId: teacherId,
        },
      });
      return updatedAssignment;
    } catch (error) {
      throw RepoError_V2.handleRepoError(error);
    }
  };

  find = async (params: { schoolId: string; classroomId: string; subjectId: string }, tx?: TX) => {
    const { schoolId, classroomId, subjectId } = params;
    const client = tx ?? prisma;
    try {
      const assignment = await client.assignment.findUnique({
        where: {
          schoolId_classroomId_subjectId: {
            schoolId,
            classroomId,
            subjectId,
          },
        },
      });
      return assignment;
    } catch (error) {
      throw RepoError_V2.handleRepoError(error);
    }
  };
}
