import getUrlParam from '@/utils/getUrlParam';
import { Request, Response } from 'express';
import { ClassroomService } from './classroom.service';
import { createClassroomRequestSchema } from '@repo/contracts/schemas/classroom/createClassRequest';
import { updateClassroomRequestSchema } from '@repo/contracts/schemas/classroom/updateClassRequest';
import { CreateClassroomUseCase } from './use-case/createClassroom.use-case';
import { classroomsQueryParams } from '@repo/contracts/schemas/classroom/getClassroomsQueryParams';

export class ClassroomController {
  constructor(
    private readonly classroomService: ClassroomService,
    private readonly createClassroomUseCase: CreateClassroomUseCase,
  ) {}

  create = async (req: Request, res: Response) => {
    const input = createClassroomRequestSchema.parse(req.body);
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const data = await this.createClassroomUseCase.execute({ input, schoolId });
    res.status(201).json({
      message: 'Class created successfully',
      data,
    });
  };

  update = async (req: Request, res: Response) => {
    const input = updateClassroomRequestSchema.parse(req.body, {});
    console.log(input);
    const classroomId = getUrlParam(req, 'classroomId', { uuid: true });
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const data = await this.classroomService.update({ input, classroomId, schoolId });
    res.status(200).json({
      message: 'Class updated successfully',
      data,
    });
  };

  findById = async (req: Request, res: Response) => {
    const classroomId = getUrlParam(req, 'classroomId', { uuid: true });
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const data = await this.classroomService.findById({ classroomId, schoolId });
    res.status(200).json({
      message: 'Class found successfully',
      data,
    });
  };

  findAll = async (req: Request, res: Response) => {
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const queryParams = classroomsQueryParams.schema.parse(req.query);
    const response = await this.classroomService.findAll({ schoolId, query: queryParams });
    res.status(200).json({
      message: 'Class found successfully',
      ...response,
    });
  };
}
