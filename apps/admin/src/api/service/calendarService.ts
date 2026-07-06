import type { ApiRes } from '@/types/api/ApiResponse2';
import type { CreateCalendarReq } from '@repo/contracts/schemas/Calendar/create';
import type { CalendarQueryParams } from '@repo/contracts/schemas/Calendar/queryParam';
import type { CalendarResponse } from '@repo/contracts/schemas/Calendar/response';
import type { UpdateCalendarReq } from '@repo/contracts/schemas/Calendar/update';
import { apiService } from '../apiService';
import { apiRoutes } from '../routes';

export const calendarService = {
  getCalendar: async (schoolId: string, params: CalendarQueryParams) =>
    apiService.getThrowable<ApiRes<CalendarResponse[]>>(apiRoutes.calendar.get(schoolId), { params }),
  createCalendar: async (schoolId: string, calendar: CreateCalendarReq) =>
    apiService.postThrowable(apiRoutes.calendar.create(schoolId), calendar),
  updateCalendar: async (schoolId: string, id: string, calendar: UpdateCalendarReq) =>
    apiService.putThrowable(apiRoutes.calendar.update(schoolId, id), calendar),
  deleteCalendar: async (schoolId: string, id: string) =>
    apiService.deleteThrowable(apiRoutes.calendar.delete(schoolId, id)),
};
