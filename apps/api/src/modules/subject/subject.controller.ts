import getUrlParam from '@/utils/getUrlParam';
import { createManySubjectRequestSchema } from '@repo/contracts/schemas/subject/createManySubjectRequest';
import { createSubjectRequestSchema } from '@repo/contracts/schemas/subject/createSubjectRequest';
import { updateSubjectRequestSchema } from '@repo/contracts/schemas/subject/updateSubjectRequest';
import { Request, Response } from 'express';
import { SubjectService } from './subject.service';
import { createManyWithExamsRequestSchema } from '@repo/contracts/schemas/subject/createManyWithExamsRequest';

export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  create = async (req: Request, res: Response) => {
    const input = createSubjectRequestSchema.parse(req.body);
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const createdSubject = await this.subjectService.create({ schoolId, input });
    res.status(201).json({
      message: 'Subject created successfully',
      data: createdSubject,
    });
  };

  createMany = async (req: Request, res: Response) => {
    const input = createManySubjectRequestSchema.parse(req.body);
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const result = await this.subjectService.createMany({ schoolId, input });
    let statusCode: number;
    let message: string;
    if (result.successCount === 0) {
      statusCode = 400;
      message = 'Failed to create subjects';
    } else if (result.successCount === input.subjects.length) {
      statusCode = 201;
      message = 'Subjects created successfully';
    } else {
      statusCode = 207;
      message = 'Partial success: some subjects were created';
    }
    res.status(statusCode).json({
      message,
      data: {
        successCount: result.successCount,
        failed: result.failedSubjects,
      },
    });
  };

  createWithExams = async (req: Request, res: Response) => {
    const input = createManyWithExamsRequestSchema.parse(req.body);
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    await this.subjectService.createWithExams({ schoolId, input });
    res.status(201).json({
      message: 'Subjects created successfully',
    });
  };

  update = async (req: Request, res: Response) => {
    const input = updateSubjectRequestSchema.parse(req.body);
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const subjectId = getUrlParam(req, 'subjectId', { uuid: true });
    const updatedSubject = await this.subjectService.update({ schoolId, subjectId, input });
    res.status(200).json({
      message: 'Subject updated successfully',
      data: updatedSubject,
    });
  };

  find = async (req: Request, res: Response) => {
    const subjectId = getUrlParam(req, 'subjectId', { uuid: true });
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const subject = await this.subjectService.find({ subjectId, schoolId });
    res.status(200).json({
      message: 'Subject found successfully',
      data: subject,
    });
  };

  findAll = async (req: Request, res: Response) => {
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const subjects = await this.subjectService.findAll({ schoolId });
    res.status(200).json({
      message: 'Subjects found successfully',
      data: subjects,
    });
  };
}
