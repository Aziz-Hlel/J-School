import { TX } from '@/types/prisma/PrismaTransaction';
import { AssignmentRepo } from './assignment.repo';

export class AssignmentInternal {
  constructor(private readonly repo: AssignmentRepo) {}

  createMany = async (params: { schoolId: string; classroomId: string; subjectIds: string[] }, tx: TX) => {
    const { schoolId, classroomId, subjectIds } = params;
    const payload = subjectIds.map((subjectId) => ({
      schoolId,
      classroomId,
      subjectId,
    }));
    const createdAssignments = await this.repo.createMany(payload, tx);
    return createdAssignments;
  };
}
