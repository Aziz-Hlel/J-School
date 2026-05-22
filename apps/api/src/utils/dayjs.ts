import dayjs from 'dayjs';

export function parseCalendarDate(dateStr: string): Date;
export function parseCalendarDate(dateStr: null): null;
export function parseCalendarDate(dateStr: string | null): Date | null;
export function parseCalendarDate(dateStr: string | null): Date | null {
  return dateStr ? dayjs(dateStr, 'YYYY-MM-DD').toDate() : null;
}

export function parseTime(timeStr: string): Date;
export function parseTime(timeStr: null): null;
export function parseTime(timeStr: string | null): Date | null;
export function parseTime(timeStr: string | null): Date | null {
  if (!timeStr) return null;
  return dayjs(`1970-01-01 ${timeStr}`, 'YYYY-MM-DD HH:mm').toDate();
}

export function toCalendarDate(date: Date): string;
export function toCalendarDate(date: null): null;
export function toCalendarDate(date: Date | null): string | null;
export function toCalendarDate(date: Date | null): string | null {
  if (!date) return null;
  return dayjs(date).format('YYYY-MM-DD');
}

export function toCalendarDateOrNull(date: Date | null): string | null {
  return date ? toCalendarDate(date) : null;
}

export function toTime(date: Date): string;
export function toTime(date: null): null;
export function toTime(date: Date | null): string | null;
export function toTime(date: Date | null): string | null {
  if (!date) return null;
  return dayjs(date).format('HH:mm');
}
