import getUrlParam from '@/utils/getUrlParam';
import { cursorQueryParamsSchema } from '@repo/contracts/schemas/cursor/cursorQueryParams';
import { createPostReqSchema } from '@repo/contracts/schemas/extraCurricular/post/create';
import { updatePostReqSchema } from '@repo/contracts/schemas/extraCurricular/post/update';
import { Request, Response } from 'express';
import { ExtraCurricularPostsService } from './ExtraCurricularPosts.service';

export class ExtraCurricularPostsController {
  constructor(private readonly extraCurricularPostsService: ExtraCurricularPostsService) {}

  create = async (req: Request, res: Response) => {
    const post = createPostReqSchema.parse(req.body);
    const schoolId = getUrlParam(req, 'schoolId');
    const extraCurricularId = getUrlParam(req, 'extraCurricularId');
    const response = await this.extraCurricularPostsService.create({ schoolId, extraCurricularId, post });
    res.json({ data: response });
  };

  update = async (req: Request, res: Response) => {
    const post = updatePostReqSchema.parse(req.body);
    const schoolId = getUrlParam(req, 'schoolId');
    const extraCurricularId = getUrlParam(req, 'extraCurricularId');
    const postId = getUrlParam(req, 'postId');
    const response = await this.extraCurricularPostsService.update({ schoolId, extraCurricularId, postId, post });
    res.json({ data: response });
  };

  delete = async (req: Request, res: Response) => {
    const schoolId = getUrlParam(req, 'schoolId');
    const extraCurricularId = getUrlParam(req, 'extraCurricularId');
    const postId = getUrlParam(req, 'postId');
    await this.extraCurricularPostsService.delete({ schoolId, extraCurricularId, postId });
    res.status(204).send();
  };

  findAll = async (req: Request, res: Response) => {
    const cursorParams = cursorQueryParamsSchema.parse(req.query);
    const schoolId = getUrlParam(req, 'schoolId');
    const extraCurricularId = getUrlParam(req, 'extraCurricularId');
    const response = await this.extraCurricularPostsService.findAll({ schoolId, extraCurricularId, cursorParams });
    res.json(response);
  };
}
