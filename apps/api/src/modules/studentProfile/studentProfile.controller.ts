import { NextFunction, Request, Response } from 'express';
import { StudentProfileService } from './studentProfile.service';
import getUrlParam from '@/utils/getUrlParam';
import { createStudentProfileRequestSchema } from '@repo/contracts/schemas/studentProfile/createStudentProfileRequest';
import { updateStudentProfileRequestSchema } from '@repo/contracts/schemas/studentProfile/updateStudentProfileRequest';

export class StudentProfileController {
  constructor(private readonly studentProfileService: StudentProfileService) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    console.log('tl');
    const input = createStudentProfileRequestSchema.parse(req.body);
    const studentId = getUrlParam(req, 'studentId', { uuid: true });
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const studentProfile = await this.studentProfileService.create({ input, studentId, schoolId });
    res.status(201).json(studentProfile);
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    const input = updateStudentProfileRequestSchema.parse(req.body);
    const studentId = getUrlParam(req, 'studentId', { uuid: true });
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const studentProfile = await this.studentProfileService.update({ input, studentId, schoolId });
    res.status(200).json(studentProfile);
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    const studentId = getUrlParam(req, 'studentId', { uuid: true });
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const studentProfile = await this.studentProfileService.getById({ studentId, schoolId });
    res.status(200).json(studentProfile);
  };
}
