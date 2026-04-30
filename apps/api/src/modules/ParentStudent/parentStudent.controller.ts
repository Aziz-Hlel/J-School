import getUrlParam from '@/utils/getUrlParam';
import { ParentStudentService } from './parentStudent.service';
import { Request, Response } from 'express';

export class ParentStudentController {
  constructor(private readonly parentStudentService: ParentStudentService) {}

  assignStudentToParent = async (req: Request, res: Response) => {
    // * TODO: Add validation for studentId, parentId they both are in the same schoolId, idk if that should be in the service layer or the middleware though
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const studentId = getUrlParam(req, 'studentId', { uuid: true });
    const parentId = getUrlParam(req, 'parentId', { uuid: true });
    const result = await this.parentStudentService.assignStudentToParent({ schoolId, studentId, parentId });
    res.status(201).json(result);
  };

  unassignStudentFromParent = async (req: Request, res: Response) => {
    // * TODO: Add validation for studentId, parentId they both are in the same schoolId, idk if that should be in the service layer or the middleware though
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const studentId = getUrlParam(req, 'studentId', { uuid: true });
    const parentId = getUrlParam(req, 'parentId', { uuid: true });
    const result = await this.parentStudentService.unassignStudentFromParent({ schoolId, studentId, parentId });
    res.status(201).json(result);
  };
}
