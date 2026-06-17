import { NotFoundError } from '@/err/service/customErrors';
import { calendarNotification } from '@/template/notification/calendar';
import { parseCalendarDate } from '@/utils/dayjs';
import { CreateCalendarReq } from '@repo/contracts/schemas/Calendar/create';
import { CalendarQueryParams } from '@repo/contracts/schemas/Calendar/queryParam';
import { UpdateCalendarReq } from '@repo/contracts/schemas/Calendar/update';
import prisma from '@repo/db';
import { NotificationSourceType, NotificationType } from '@repo/db/prisma/enums';
import { globalNotificationService } from '../Notification/notification.service';
import { CalendarMapper } from './calendar.mapper';

export class CalendarService {
  constructor() {}
  create = async (params: { input: CreateCalendarReq; schoolId: string }) => {
    const { input, schoolId } = params;
    const createdCalendar = await prisma.calendar.create({
      data: {
        schoolId,
        title: input.title,
        description: input.description,
        type: input.type,
        startDate: parseCalendarDate(input.startDate),
        startTime: input.startTime,
        endDate: parseCalendarDate(input.endDate),
        endTime: input.endTime,
      },
    });
    if (input.sendNotification) {
      globalNotificationService.create({
        input: {
          schoolId,
          sourceId: createdCalendar.id,
          type: {
            type: NotificationType.GLOBAL,
          },
          title: calendarNotification.title(),
          content: calendarNotification.content(),
          sourceType: NotificationSourceType.CALENDAR,
        },
      });
    }

    const response = CalendarMapper.toResponse(createdCalendar);
    return response;
  };

  update = async (params: { id: string; input: UpdateCalendarReq; schoolId: string }) => {
    const { id, input, schoolId } = params;

    const updatedCalendar = await prisma.calendar.update({
      where: {
        id,
        schoolId,
      },
      data: {
        ...input,
      },
    });

    const response = CalendarMapper.toResponse(updatedCalendar);
    return response;
  };

  delete = async (params: { id: string; schoolId: string }) => {
    const { id, schoolId } = params;
    await prisma.calendar.deleteMany({
      where: {
        id,
        schoolId,
      },
    });
  };

  findAll = async (params: { schoolId: string; query: CalendarQueryParams }) => {
    const { schoolId, query } = params;
    const calendars = await prisma.calendar.findMany({
      where: {
        schoolId,

        OR: [
          {
            startDate: {
              gte: query.startDate,
              lte: query.endDate,
            },
          },
          {
            endDate: {
              gte: query.startDate,
              lte: query.endDate,
            },
          },
        ],
      },
      orderBy: [
        {
          startDate: 'asc',
        },
        {
          startTime: 'asc',
        },
      ],
    });

    const response = calendars.map(CalendarMapper.toResponse);
    return response;
  };

  findById = async (params: { id: string; schoolId: string }) => {
    const { id, schoolId } = params;
    const calendar = await prisma.calendar.findUnique({
      where: {
        id,
        schoolId,
      },
    });
    if (!calendar) {
      throw new NotFoundError('Calendar not found');
    }
    const response = CalendarMapper.toResponse(calendar);
    return response;
  };
}
