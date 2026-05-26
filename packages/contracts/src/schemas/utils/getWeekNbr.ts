import dayjs from 'dayjs';

export const toWeekNbr = (input: Date | string = new Date()) => {
  const date = dayjs(input);
  const schoolYearStartYear = date.month() < 8 ? date.year() - 1 : date.year();

  const schoolYearStart = dayjs(new Date(schoolYearStartYear, 9, 1));

  const diffInDays = date.diff(schoolYearStart, 'day') + 1;

  return Math.ceil(diffInDays / 7);
};
