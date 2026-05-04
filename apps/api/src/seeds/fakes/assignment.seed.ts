import { TX } from '@/types/prisma/PrismaTransaction';
import prisma from '@repo/db';

export class AssignmentSeed {
  constructor() {}

  run = async (
    params: {
      schoolId: string;
      input: {
        subjectId: string;
        classroomId: string;
        teacherId?: string;
      };
    },
    tx?: TX,
  ) => {
    const { schoolId, input } = params;
    const client = tx ?? prisma;

    const assignments = client.assignment.upsert({
      where: {
        schoolId_classroomId_subjectId: {
          schoolId,
          classroomId: input.classroomId,
          subjectId: input.subjectId,
        },
      },
      create: {
        schoolId,
        classroomId: input.classroomId,
        subjectId: input.subjectId,
      },
      update: {
        teacherId: input.teacherId,
      },
    });

    return assignments;
  };
}
