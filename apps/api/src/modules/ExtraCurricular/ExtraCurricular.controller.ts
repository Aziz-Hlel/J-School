import getUrlParam from '@/utils/getUrlParam';
import { createExtraCurricularRequestSchema } from '@repo/contracts/schemas/extraCurricular/createExtraCurricularRequest';
import { extraCurricularQueryParams } from '@repo/contracts/schemas/extraCurricular/findAllQueryParams';
import { updateExtraCurricularReqSchema } from '@repo/contracts/schemas/extraCurricular/updateExtraCurricularReq';
import type { Request, Response } from 'express';
import { ExtraCurricularService } from './ExtraCurricular.service';

export class ExtraCurricularController {
  constructor(private readonly extraCurricularService: ExtraCurricularService) {}

  create = async (req: Request, res: Response) => {
    const input = createExtraCurricularRequestSchema.parse(req.body);
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const data = await this.extraCurricularService.create({ input, schoolId });
    res.status(201).json({
      message: 'Extra curricular created successfully',
      data,
    });
  };

  update = async (req: Request, res: Response) => {
    const input = updateExtraCurricularReqSchema.parse(req.body);
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const extraCurricularId = getUrlParam(req, 'extraCurricularId', { uuid: true });
    const data = await this.extraCurricularService.update({ input, schoolId, extraCurricularId });
    res.status(200).json({
      message: 'Extra curricular updated successfully',
      data,
    });
  };

  delete = async (req: Request, res: Response) => {
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const extraCurricularId = getUrlParam(req, 'extraCurricularId', { uuid: true });
    await this.extraCurricularService.delete({ schoolId, extraCurricularId });
    res.status(200).json({
      message: 'Extra curricular deleted successfully',
    });
  };

  findAll = async (req: Request, res: Response) => {
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const query = extraCurricularQueryParams.schema.parse(req.query);
    const data = await this.extraCurricularService.findAll({ schoolId, query });
    res.status(200).json({
      message: 'Extra curriculars fetched successfully',
      ...data,
    });
  };

  findOne = async (req: Request, res: Response) => {
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const extraCurricularId = getUrlParam(req, 'extraCurricularId', { uuid: true });
    const data = await this.extraCurricularService.findOne({ schoolId, extraCurricularId });
    res.status(200).json({
      message: 'Extra curricular fetched successfully',
      data,
    });
  };

  // ! wrong approach , just make one api to set all student in the extra curricular
  assignToStudent = async (req: Request, res: Response) => {
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const extraCurricularId = getUrlParam(req, 'extraCurricularId', { uuid: true });
    const studentId = getUrlParam(req, 'studentId', { uuid: true });
    const data = await this.extraCurricularService.assignToStudent({ schoolId, extraCurricularId, studentId });
    res.status(200).json({
      message: 'Extra curricular assigned to student successfully',
      data,
    });
  };

  unassignFromStudent = async (req: Request, res: Response) => {
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const extraCurricularId = getUrlParam(req, 'extraCurricularId', { uuid: true });
    const studentId = getUrlParam(req, 'studentId', { uuid: true });
    const data = await this.extraCurricularService.unassignFromStudent({ schoolId, extraCurricularId, studentId });
    res.status(200).json({
      message: 'Extra curricular unassigned from student successfully',
      data,
    });
  };

  getStudents = async (req: Request, res: Response) => {
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const extraCurricularId = getUrlParam(req, 'extraCurricularId', { uuid: true });
    const data = await this.extraCurricularService.getStudents({ schoolId, extraCurricularId });
    res.status(200).json({
      message: 'Extra curricular students fetched successfully',
      data,
    });
  };
}
