import dayjs from 'dayjs';

export const parseCalendarDate = (dateStr: string | null) => (dateStr ? dayjs(dateStr, 'YYYY-MM-DD').toDate() : null);

export function parseTime(timeStr: string): Date;
export function parseTime(timeStr: null): null;
export function parseTime(timeStr: string | null): Date | null;
export function parseTime(timeStr: string | null): Date | null {
  if (!timeStr) return null;
  return dayjs(`1970-01-01 ${timeStr}`, 'YYYY-MM-DD HH:mm').toDate();
}

export const toCalendarDate = (date: Date) => dayjs(date).format('YYYY-MM-DD');
export const toCalendarDateOrNull = (date: Date | null) => (date ? toCalendarDate(date) : null);

export function toTime(date: Date): string;
export function toTime(date: null): null;
export function toTime(date: Date | null): string | null;
export function toTime(date: Date | null): string | null {
  if (!date) return null;
  return dayjs(date).format('HH:mm');
}
