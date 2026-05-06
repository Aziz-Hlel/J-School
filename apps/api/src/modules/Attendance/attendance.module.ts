import { AttendanceController } from './attendance.controller';
import { createRouter } from './attendance.route';
import { AttendanceService } from './attendance.service';

export const AttendanceModule = () => {
  const service = new AttendanceService();
  const controller = new AttendanceController(service);
  const attendanceRouter = createRouter(controller);
  return {
    attendanceRouter,
  };
};
