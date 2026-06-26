import getUrlParam from '@/utils/getUrlParam';
import { createExamScheduleRequestSchema } from '@repo/contracts/schemas/examSchedule/createExamScheduleRequest';
import { updateExamScheduleRequestSchema } from '@repo/contracts/schemas/examSchedule/updateExamScheduleRequest';
import { Request, Response } from 'express';
import { ExamScheduleService } from './ExamSchedule.service';

export class ExamScheduleController {
  constructor(private readonly examScheduleService: ExamScheduleService) {}

  create = async (req: Request, res: Response) => {
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const input = createExamScheduleRequestSchema.parse(req.body);
    await this.examScheduleService.create({
      schoolId,
      input,
    });

    res.status(201).json({
      message: 'Exam schedule created successfully',
    });
  };

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

  resetAll = async (req: Request, res: Response) => {
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    await this.examScheduleService.resetAll({ schoolId });

    res.status(204).send();
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
