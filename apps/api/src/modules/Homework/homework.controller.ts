import type { Request, Response } from 'express';
import { HomeworkService } from './homework.service';
import getUrlParam from '@/utils/getUrlParam';
import { createHomeworkReqSchema } from '@repo/contracts/schemas/Homework/create';
import { updateHomeworkReqSchema } from '@repo/contracts/schemas/Homework/update';
import { homeworkQueryParams } from '@repo/contracts/schemas/Homework/queryParam';

export class HomeworkController {
  constructor(private readonly service: HomeworkService) {}

  create = async (req: Request, res: Response) => {
    const input = createHomeworkReqSchema.parse(req.body);
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const result = await this.service.create({ schoolId, input });
    return res.status(201).json(result);
  };

  update = async (req: Request, res: Response) => {
    const input = updateHomeworkReqSchema.parse(req.body);
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const id = getUrlParam(req, 'homeworkId', { uuid: true });
    const result = await this.service.update({ schoolId, id, input });
    return res.status(200).json(result);
  };

  delete = async (req: Request, res: Response) => {
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const id = getUrlParam(req, 'homeworkId', { uuid: true });
    const result = await this.service.delete({ schoolId, id });
    return res.status(204).json(result);
  };

  findById = async (req: Request, res: Response) => {
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const id = getUrlParam(req, 'homeworkId', { uuid: true });
    const result = await this.service.findById({ schoolId, id });
    return res.status(200).json(result);
  };

  find = async (req: Request, res: Response) => {
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const query = homeworkQueryParams.schema.parse(req.query);
    const result = await this.service.find({ schoolId, query });
    return res.status(200).json(result);
  };
}
