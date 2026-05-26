import { CalendarController } from './calendar.controller';
import { createRouter } from './calendar.route';
import { CalendarService } from './calendar.service';

export const CalendarModule = () => {
  const service = new CalendarService();
  const controller = new CalendarController(service);
  const calendarRouter = createRouter(controller);
  return {
    calendarRouter,
  };
};
