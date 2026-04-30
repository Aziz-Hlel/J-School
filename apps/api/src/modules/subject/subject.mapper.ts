import { Subject } from '@repo/db/prisma/client';
import { SubjectResponse } from '@repo/contracts/schemas/subject/subjectResponse';

export class SubjectMapper {
  static toResponse = (subject: Subject): SubjectResponse => {
    return {
      id: subject.id,
      name: {
        en: subject.name_en,
        fr: subject.name_fr,
        ar: subject.name_ar,
      },
      grade: subject.grade,
      hoursPerWeek: subject.hoursPerWeek,
      domain: subject.domain,
    };
  };
}
