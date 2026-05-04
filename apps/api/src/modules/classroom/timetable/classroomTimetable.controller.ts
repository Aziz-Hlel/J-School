import getUrlParam from '@/utils/getUrlParam';
import { createClassroomTimetableRequestSchema } from '@repo/contracts/schemas/classroom/timeTable/createTimetableRequest2';
import { Request, Response } from 'express';
import { ClassroomTimetableService } from './classroomTimetable.service';
import { updateTimetableRequestSchema } from '@repo/contracts/schemas/timeTable/updateTimetableRequest';

export class ClassroomTimetableController {
  constructor(private readonly classroomTimetableService: ClassroomTimetableService) {}
  findAll = async (req: Request, res: Response) => {
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const classroomId = getUrlParam(req, 'classroomId', { uuid: true });
    const data = await this.classroomTimetableService.getTimeTable({ schoolId, classroomId });
    res.status(200).json({
      message: 'Time table found successfully',
      data,
    });
  };

  async create(req: Request, res: Response) {
    const schoolId = getUrlParam(req, 'schoolId');
    const classroomId = getUrlParam(req, 'classroomId');

    const input = createClassroomTimetableRequestSchema.parse(req.body);
    const timetableResponse = await this.classroomTimetableService.create({ input, schoolId, classroomId });
    res.status(201).json({
      message: 'Timetable created successfully',
      data: timetableResponse,
    });
  }

  async update(req: Request, res: Response) {
    const schoolId = getUrlParam(req, 'schoolId');
    const timetableId = getUrlParam(req, 'timetableId');

    const input = updateTimetableRequestSchema.parse(req.body);
    const timetableResponse = await this.classroomTimetableService.update({ input, schoolId, timetableId });
    res.status(200).json({
      message: 'Timetable updated successfully',
      data: timetableResponse,
    });
  }

  async delete(req: Request, res: Response) {
    const schoolId = getUrlParam(req, 'schoolId');
    const timetableId = getUrlParam(req, 'timetableId');

    await this.classroomTimetableService.delete({ schoolId, timetableId });
    res.status(200).json({
      message: 'Timetable deleted successfully',
    });
  }
}
