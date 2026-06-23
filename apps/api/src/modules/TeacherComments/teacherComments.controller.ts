import getUrlParam from '@/utils/getUrlParam';
import { createTeacherCommentsReqSchema } from '@repo/contracts/schemas/TeacherComments/create';
import { replyToCommentReqSchema } from '@repo/contracts/schemas/TeacherComments/replyToComment';
import type { Request, Response } from 'express';
import { TeacherCommentsService } from './teacherComments.service';
import { updateTeacherCommentsReqSchema } from '@repo/contracts/schemas/TeacherComments/update';

export class TeacherCommentsController {
  constructor(private readonly service: TeacherCommentsService) {}

  create = async (req: Request, res: Response) => {
    const input = createTeacherCommentsReqSchema.parse(req.body);
    const teacherId = getUrlParam(req, 'teacherId', { uuid: true });
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const result = await this.service.create({ input, teacherId, schoolId });
    res.status(201).json({
      message: 'Comment created successfully',
      data: result,
    });
  };

  update = async (req: Request, res: Response) => {
    const input = updateTeacherCommentsReqSchema.parse(req.body);
    const id = getUrlParam(req, 'teacherCommentId', { uuid: true });
    const result = await this.service.update({ input, id });
    res.status(200).json({
      message: 'Comment updated successfully',
      data: result,
    });
  };

  delete = async (req: Request, res: Response) => {
    const id = getUrlParam(req, 'teacherCommentId', { uuid: true });
    await this.service.delete({ id });
    res.status(204).send();
  };

  findById = async (req: Request, res: Response) => {
    const id = getUrlParam(req, 'teacherCommentId', { uuid: true });
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const result = await this.service.find({ id, schoolId });
    res.status(200).json({
      message: 'Comment found successfully',
      data: result,
    });
  };

  replyComment = async (req: Request, res: Response) => {
    const input = replyToCommentReqSchema.parse(req.body);
    const id = getUrlParam(req, 'teacherCommentId', { uuid: true });
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const result = await this.service.replyTeacherComment({ input, id, schoolId });
    res.status(200).json({
      message: 'Comment replied successfully',
      data: result,
    });
  };
}
