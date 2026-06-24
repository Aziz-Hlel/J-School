import getUrlParam from '@/utils/getUrlParam';
import { Request, Response } from 'express';
import { ParentStudentService } from './parentStudent.service';

export class ParentStudentController {
  constructor(private readonly parentStudentService: ParentStudentService) {}

  assignStudentToParent = async (req: Request, res: Response) => {
    // * TODO: Add validation for studentId, parentId they both are in the same schoolId, idk if that should be in the service layer or the middleware though
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const studentId = getUrlParam(req, 'studentId', { uuid: true });
    const parentId = getUrlParam(req, 'parentId', { uuid: true });
    await this.parentStudentService.assignStudentToParent({ schoolId, studentId, parentId });
    res.sendStatus(204);
  };

  unassignStudentFromParent = async (req: Request, res: Response) => {
    // * TODO: Add validation for studentId, parentId they both are in the same schoolId, idk if that should be in the service layer or the middleware though
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const studentId = getUrlParam(req, 'studentId', { uuid: true });
    const parentId = getUrlParam(req, 'parentId', { uuid: true });
    await this.parentStudentService.unassignStudentFromParent({ schoolId, studentId, parentId });
    res.sendStatus(204);
  };
}
