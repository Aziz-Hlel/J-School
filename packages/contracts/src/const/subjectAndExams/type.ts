import type { SubjectDomain } from '../../types/enums/enums';

export type BaseSubjectsKeys =
  | 'arabic'
  | 'french'
  | 'english'
  | 'math'
  | 'science'
  | 'technology'
  | 'islam'
  | 'history'
  | 'geography'
  | 'civic'
  | 'drawing'
  | 'music'
  | 'sport';

export type InitSubjectsPerGradeType = {
  name: {
    en: string;
    fr: string;
    ar: string;
  };
  hoursPerWeek: number;
  domain: SubjectDomain;
};

export type InitExamsPerSubjectType = {
  name: {
    en: string;
    fr: string;
    ar: string;
  };
  durationInMin: number;
}[];

export type InitSubjectWithExamsType = {
  subject: InitSubjectsPerGradeType;
  exams: InitExamsPerSubjectType;
};
