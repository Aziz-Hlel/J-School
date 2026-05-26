import getUrlParam from '@/utils/getUrlParam';
import { createCalendarReqSchema } from '@repo/contracts/schemas/Calendar/create';
import { calendarQueryParamsSchema } from '@repo/contracts/schemas/Calendar/queryParam';
import type { Request, Response } from 'express';
import { CalendarService } from './calendar.service';

export class CalendarController {
  constructor(private readonly service: CalendarService) {}

  create = async (req: Request, res: Response) => {
    const schoolId = getUrlParam(req, 'schoolId');
    const input = createCalendarReqSchema.parse(req.body);
    const response = await this.service.create({ input, schoolId });
    res.status(201).json({
      data: response,
    });
  };

  update = async (req: Request, res: Response) => {
    const schoolId = getUrlParam(req, 'schoolId');
    const id = getUrlParam(req, 'id');
    const input = createCalendarReqSchema.parse(req.body);
    const response = await this.service.update({ id, input, schoolId });
    res.status(200).json({
      data: response,
    });
  };

  delete = async (req: Request, res: Response) => {
    const schoolId = getUrlParam(req, 'schoolId');
    const id = getUrlParam(req, 'id');
    await this.service.delete({ id, schoolId });
    res.send(204);
  };

  findById = async (req: Request, res: Response) => {
    const schoolId = getUrlParam(req, 'schoolId');
    const id = getUrlParam(req, 'id');
    const response = await this.service.findById({ id, schoolId });
    res.status(200).json({
      data: response,
    });
  };

  findAll = async (req: Request, res: Response) => {
    const schoolId = getUrlParam(req, 'schoolId');
    const query = calendarQueryParamsSchema.parse(req.query);
    const response = await this.service.findAll({ schoolId, query });
    res.status(200).json({
      data: response,
    });
  };
}
