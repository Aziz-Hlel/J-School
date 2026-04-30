import { AuthenticatedRequest } from '@/types/auth/AuthenticatedRequest';
import { Response } from 'express';
import getUrlParam from '@/utils/getUrlParam';
import { UserAppService } from './user.app.service';
import { createSimpleUserRequestSchema } from '@repo/contracts/schemas/user/createSimpleUserRequest';

export class UserController {
  constructor(private readonly userService: UserAppService) {}

  create = async (req: AuthenticatedRequest, res: Response) => {
    // * most likely to be disposed (reason 1 : it's already bein replaced with the use case, reason 2 : you need to create the user based on it prespective place like staff parent or teacher)
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const schema = createSimpleUserRequestSchema.parse(req.body);
    const result = await this.userService.createSimpleUser({ payload: schema, schoolId });
    res.status(201).json(result);
  };

  getById = async (req: AuthenticatedRequest, res: Response) => {
    // * check if user is authorized to get this user (either owner or qualified roles but not parent for example or outside school except superadmin maybe)
    // ! you need to add parent response and teacher response etc
    const userId = getUrlParam(req, 'userId', { uuid: true });
    const result = await this.userService.getById({ userId, schoolId: getUrlParam(req, 'schoolId', { uuid: true }) });
    res.status(200).json(result);
  };

  update = async (req: AuthenticatedRequest, res: Response) => {
    // * not sure if you gone implment this cuz you ll propebly have separate endpoints for updating specific user based on role like parent or teacher , but again the client could call this endpoint to edit a simple user
    throw new Error('Not implemented yet');
  };
}
