import { baseExams } from './shared/baseEams';
import { baseSubjects } from './shared/baseSubjects';
import type { BaseSubjectsKeys, InitSubjectWithExamsType } from './type';

export const subjectsGradeFour = {
  arabic: { subject: { ...baseSubjects.arabic, hoursPerWeek: 1 }, exams: baseExams.arabic },
  french: { subject: { ...baseSubjects.french, hoursPerWeek: 1 }, exams: baseExams.french },
  math: { subject: { ...baseSubjects.math, hoursPerWeek: 1 }, exams: baseExams.math },
  science: { subject: { ...baseSubjects.science, hoursPerWeek: 1 }, exams: baseExams.science },
  technology: { subject: { ...baseSubjects.technology, hoursPerWeek: 1 }, exams: baseExams.technology },
  islam: { subject: { ...baseSubjects.islam, hoursPerWeek: 1 }, exams: baseExams.islam },
  drawing: { subject: { ...baseSubjects.drawing, hoursPerWeek: 1 }, exams: baseExams.drawing },
  music: { subject: { ...baseSubjects.music, hoursPerWeek: 1 }, exams: baseExams.music },
  sport: { subject: { ...baseSubjects.sport, hoursPerWeek: 1 }, exams: baseExams.sport },
} satisfies Partial<Record<BaseSubjectsKeys, InitSubjectWithExamsType>>;
