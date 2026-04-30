import type { InitSubjectsPerGradeType } from '.';
import { baseSubjects } from './shared/allSubject';

export const subjectsGradeOne: InitSubjectsPerGradeType[] = [
  { ...baseSubjects.arabic, hoursPerWeek: 1 },
  { ...baseSubjects.math, hoursPerWeek: 1 },
  { ...baseSubjects.science, hoursPerWeek: 1 },
  { ...baseSubjects.technology, hoursPerWeek: 1 },
  { ...baseSubjects.islam, hoursPerWeek: 1 },
  { ...baseSubjects.drawing, hoursPerWeek: 1 },
  { ...baseSubjects.music, hoursPerWeek: 1 },
  { ...baseSubjects.sport, hoursPerWeek: 1 },
];
