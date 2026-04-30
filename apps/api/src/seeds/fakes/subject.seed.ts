import { prisma } from '@/bootstrap/db.init';
import { RepoError_V2 } from '@/err/repo/DbError.v2';
import { ClassGrade, SubjectDomain } from '@repo/db/prisma/enums';
import { TX } from '@/types/prisma/PrismaTransaction';
import { CreateManySubjectRequest } from '@repo/contracts/schemas/subject/createManySubjectRequest';

export class SubjectSeed {
  constructor() {}

  run = async (
    params: {
      schoolId: string;
      input: {
        name: {
          en: string;
          fr: string;
          ar: string;
        };
        grade: ClassGrade;
        domain: SubjectDomain;
        hoursPerWeek: number;
      }[];
    },
    tx?: TX,
  ) => {
    const { schoolId, input } = params;
    const client = tx ?? prisma;
    try {
      const createdSubjects = await client.subject.createMany({
        data: input.map((subject) => ({
          name_en: subject.name.en,
          name_fr: subject.name.fr,
          name_ar: subject.name.ar,
          grade: subject.grade,
          hoursPerWeek: subject.hoursPerWeek,
          domain: subject.domain,
          schoolId,
        })),
        skipDuplicates: true,
      });
      return createdSubjects;
    } catch (error) {
      throw RepoError_V2.handleRepoError(error);
    }
  };
}
