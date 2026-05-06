import type { Request, Response } from 'express';
import { AttendanceService } from './attendance.service';
import getUrlParam from '@/utils/getUrlParam';
import { attendanceSyncDto } from '@repo/contracts/schemas/Attendance/sync';

export class AttendanceController {
  constructor(private readonly service: AttendanceService) {}

  sync = async (req: Request, res: Response) => {
    const schoolId = getUrlParam(req, 'schoolId');
    const body = attendanceSyncDto.parse(req.body);

    await this.service.sync({ schoolId, input: body });

    res.status(201).json({ message: 'Attendance synced successfully' });
  };
}
