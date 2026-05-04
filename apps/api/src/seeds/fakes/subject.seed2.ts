import { prisma } from '@/bootstrap/db.init';
import { RepoError_V2 } from '@/err/repo/DbError.v2';
import { TX } from '@/types/prisma/PrismaTransaction';
import { InitExamsPerSubjectType, InitSubjectsPerGradeType } from '@repo/contracts/const/subjectAndExams/type';
import { ClassGrade } from '@repo/db/prisma/enums';

export class SubjectAndExamsSeed2 {
  constructor() {}

  run = async (
    params: {
      schoolId: string;
      input: InitSubjectsPerGradeType;
      grade: ClassGrade;
      exams: InitExamsPerSubjectType;
    },
    tx?: TX,
  ) => {
    const { schoolId, input, grade, exams } = params;
    const client = tx ?? prisma;
    try {
      const createdSubjects = await client.subject.upsert({
        where: {
          schoolId_grade_name_en: {
            name_en: input.name.en,
            schoolId,
            grade,
          },
        },
        create: {
          name_en: input.name.en,
          name_fr: input.name.fr,
          name_ar: input.name.ar,
          hoursPerWeek: input.hoursPerWeek,
          domain: input.domain,
          schoolId,
          grade,
          exams: {
            createMany: {
              data: exams.map((exam) => ({
                name_en: exam.name.en,
                name_fr: exam.name.fr,
                name_ar: exam.name.ar,
                durationInMin: exam.durationInMin,
                schoolId,
              })),
              skipDuplicates: true,
            },
          },
        },
        update: {
          hoursPerWeek: input.hoursPerWeek,
          domain: input.domain,
        },
      });
      return createdSubjects;
    } catch (error) {
      throw RepoError_V2.handleRepoError(error);
    }
  };
}
