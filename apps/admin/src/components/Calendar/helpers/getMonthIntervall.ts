import type { CalendarQueryParams } from '@repo/contracts/schemas/Calendar/queryParam';
import dayjs from 'dayjs';

/**
 * Gets the start and end date for the current month
 */
export const getCurrentMonthRange = (): CalendarQueryParams => {
  const now = dayjs();
  return {
    startDate: now.startOf('month').toDate(),
    endDate: now.endOf('month').toDate(),
  };
};

/**
 * Gets the start and end date for the next month relative to a given date
 */
export const getNextMonthRange = (from?: Date): CalendarQueryParams => {
  const base = from ? dayjs(from) : dayjs();
  const nextMonth = base.add(1, 'month');
  return {
    startDate: nextMonth.startOf('month').toDate(),
    endDate: nextMonth.endOf('month').toDate(),
  };
};

/**
 * Gets the start and end date for the previous month relative to a given date
 */
export const getPreviousMonthRange = (from?: Date): CalendarQueryParams => {
  const base = from ? dayjs(from) : dayjs();
  const prevMonth = base.subtract(1, 'month');
  return {
    startDate: prevMonth.startOf('month').toDate(),
    endDate: prevMonth.endOf('month').toDate(),
  };
};

/**
 * Formats a CalendarQueryParams startDate into a "Month YYYY" label
 */
export const getMonthLabel = (startDate: Date): string => {
  return dayjs(startDate).format('MMMM YYYY');
};
