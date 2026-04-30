import { ClassGrade } from '@repo/db/prisma/enums';
import { SubjectRepo } from './subject.repo';

export class SubjectInternal {
  constructor(private readonly repo: SubjectRepo) {}

  findByGrade = async (params: { schoolId: string; grade: ClassGrade }) => {
    const { schoolId, grade } = params;
    return await this.repo.findByGrade({ schoolId, grade });
  };
}
