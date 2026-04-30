import getUrlParam from '@/utils/getUrlParam';
import { createTimetableRequestSchema } from '@repo/contracts/schemas/timeTable/createTimetableRequest';
import { updateTimetableRequestSchema } from '@repo/contracts/schemas/timeTable/updateTimetableRequest';
import { Request, Response } from 'express';
import { TimetableService } from './timetable.service';

export class TimetableController {
  constructor(private readonly timetableService: TimetableService) {}

  async create(req: Request, res: Response) {
    const schoolId = getUrlParam(req, 'schoolId');
    const assignmentId = getUrlParam(req, 'assignmentId');

    const input = createTimetableRequestSchema.parse(req.body);
    const timetableResponse = await this.timetableService.create({ input, schoolId, assignmentId });
    res.status(201).json({
      message: 'Timetable created successfully',
      data: timetableResponse,
    });
  }

  async update(req: Request, res: Response) {
    const schoolId = getUrlParam(req, 'schoolId');
    const timetableId = getUrlParam(req, 'timetableId');

    const input = updateTimetableRequestSchema.parse(req.body);
    const timetableResponse = await this.timetableService.update({ input, schoolId, timetableId });
    res.status(200).json({
      message: 'Timetable updated successfully',
      data: timetableResponse,
    });
  }

  async delete(req: Request, res: Response) {
    const schoolId = getUrlParam(req, 'schoolId');
    const timetableId = getUrlParam(req, 'timetableId');

    await this.timetableService.delete({ schoolId, timetableId });
    res.status(200).json({
      message: 'Timetable deleted successfully',
    });
  }
}
