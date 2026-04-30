import { ClassGrade } from '../../types/enums/enums';
import { subjectsGradeFive } from './grade.five';
import { subjectsGradeFour } from './grade.four';
import { subjectsGradeOne } from './grade.One';
import { subjectsGradeSix } from './grade.six';
import { subjectsGradeThree } from './grade.three';
import { subjectsGradeTwo } from './grade.two';

export const initSubjectsWithExamsPerGrade = {
  [ClassGrade.KG]: [],
  [ClassGrade.ONE]: subjectsGradeOne,
  [ClassGrade.TWO]: subjectsGradeTwo,
  [ClassGrade.THREE]: subjectsGradeThree,
  [ClassGrade.FOUR]: subjectsGradeFour,
  [ClassGrade.FIVE]: subjectsGradeFive,
  [ClassGrade.SIX]: subjectsGradeSix,
};
