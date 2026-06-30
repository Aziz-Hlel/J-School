import { AuthenticatedRequest } from '@/types/auth/AuthenticatedRequest';
import getUrlParam from '@/utils/getUrlParam';
import { adminTeacherCommentsQueryParams } from '@repo/contracts/schemas/school/adminTeacherCommentsQuery';
import { CreateSchoolRequestSchema } from '@repo/contracts/schemas/school/createSchoolRequest';
import { selectParentsQueryParamsSchema } from '@repo/contracts/schemas/school/selectParentsQueryParams';
import { updateSchoolRequestSchema } from '@repo/contracts/schemas/school/updateSchoolRequest';
import { Response } from 'express';
import { SchoolAppService } from './school.app.service';

export class SchoolController {
  constructor(private readonly schoolService: SchoolAppService) {}

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

  selectClassrooms = async (req: AuthenticatedRequest, res: Response) => {
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const classrooms = await this.schoolService.selectClassrooms({ schoolId });
    res.status(200).json({
      message: 'Classrooms fetched successfully',
      data: classrooms,
    });
  };

  selectParents = async (req: AuthenticatedRequest, res: Response) => {
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const query = selectParentsQueryParamsSchema.parse(req.query);
    const parents = await this.schoolService.selectParents({ schoolId, query });
    res.status(200).json({
      message: 'Parents fetched successfully',
      ...parents,
    });
  };

  findTeacherComments = async (req: AuthenticatedRequest, res: Response) => {
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const query = adminTeacherCommentsQueryParams.schema.parse(req.query);
    const teacherComments = await this.schoolService.findTeacherComments({ schoolId, query });
    res.status(200).json({
      message: 'Teacher comments fetched successfully',
      ...teacherComments,
    });
  };

  deleteTeacherComment = async (req: AuthenticatedRequest, res: Response) => {
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const teacherCommentId = getUrlParam(req, 'teacherCommentId', { uuid: true });
    await this.schoolService.deleteTeacherComments({ schoolId, teacherCommentId });
    res.status(204).send();
  };
}
