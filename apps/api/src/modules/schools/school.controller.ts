import { AuthenticatedRequest } from '@/types/auth/AuthenticatedRequest';
import getUrlParam from '@/utils/getUrlParam';
import { CreateSchoolRequestSchema } from '@repo/contracts/schemas/school/createSchoolRequest';
import { updateSchoolRequestSchema } from '@repo/contracts/schemas/school/updateSchoolRequest';
import { Response } from 'express';
import { ISchoolAppService } from './school.app.service';

export class SchoolController {
  constructor(private readonly schoolService: ISchoolAppService) {}

  create = async (req: AuthenticatedRequest, res: Response) => {
    const schema = CreateSchoolRequestSchema.parse(req.body);
    const token = req.token;
    const school = await this.schoolService.create({ schema, token });
    res.status(201).json({ message: 'School created successfully', school: { id: school.id } });
  };

  update = async (req: AuthenticatedRequest, res: Response) => {
    const schema = updateSchoolRequestSchema.parse(req.body);
    const token = req.token;
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    await this.schoolService.update({ schema, accountId: token.claims.accountId, schoolId });
    res.status(200).json({ message: 'School updated successfully' });
  };

  getMySchool = async (req: AuthenticatedRequest, res: Response) => {
    const school = await this.schoolService.getMySchool({ token: req.token });
    res.status(200).json(school);
  };

  getById = async (req: AuthenticatedRequest, res: Response) => {
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const school = await this.schoolService.getById({ schoolId, token: req.token });
    res.status(200).json(school);
  };

  getPage = async (_: AuthenticatedRequest, __: Response) => {
    throw new Error('Not implemented');
  };

  delete = async (_: AuthenticatedRequest, __: Response) => {
    throw new Error('Not implemented');
  };
}
