import { ExamScheduleService } from './ExamSchedule.service';
import { Request, Response } from 'express';
import { updateExamScheduleRequestSchema } from '@repo/contracts/schemas/examSchedule/updateExamScheduleRequest';
import getUrlParam from '@/utils/getUrlParam';

export class ExamScheduleController {
  constructor(private readonly examScheduleService: ExamScheduleService) {}

  update = async (req: Request, res: Response) => {
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const input = updateExamScheduleRequestSchema.parse(req.body);
    const updatedExamSchedule = await this.examScheduleService.update({
      schoolId,
      input,
    });

    res.status(200).json({
      message: 'Exam schedule updated successfully',
      data: updatedExamSchedule,
    });
  };

  findByClassroom = async (req: Request, res: Response) => {
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const classroomId = getUrlParam(req, 'classroomId', { uuid: true });
    const examSchedules = await this.examScheduleService.findByClassroom({
      schoolId,
      classroomId,
    });

    res.status(200).json({
      message: 'Exam schedules fetched successfully',
      data: examSchedules,
    });
  };
}
