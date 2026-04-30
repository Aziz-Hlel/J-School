import type { InitSubjectsPerGradeType } from '.';
import { ClassGrade } from '../../types/enums/enums';
import { subjectsGradeOne } from './grade.One';
import { subjectsGradeTwo } from './grade.two';
import { subjectsGradeThree } from './grade.three';
import { subjectsGradeFour } from './grade.four';
import { subjectsGradeFive } from './grade.five';
import { subjectsGradeSix } from './grade.six';

export const subjectsPerGrade: Record<ClassGrade, InitSubjectsPerGradeType[]> = {
  [ClassGrade.KG]: [],
  [ClassGrade.ONE]: subjectsGradeOne,
  [ClassGrade.TWO]: subjectsGradeTwo,
  [ClassGrade.THREE]: subjectsGradeThree,
  [ClassGrade.FOUR]: subjectsGradeFour,
  [ClassGrade.FIVE]: subjectsGradeFive,
  [ClassGrade.SIX]: subjectsGradeSix,
};
