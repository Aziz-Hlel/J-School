import type { SubjectDomain } from '../../types/enums/enums';

export type InitSubjectsPerGradeType = {
  name: {
    en: string;
    fr: string;
    ar: string;
  };
  hoursPerWeek: number;
  domain: SubjectDomain;
};
