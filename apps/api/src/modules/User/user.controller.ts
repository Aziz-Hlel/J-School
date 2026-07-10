import { AuthenticatedRequest } from '@/types/auth/AuthenticatedRequest';
import getUrlParam from '@/utils/getUrlParam';
import { createSimpleUserRequestSchema } from '@repo/contracts/schemas/user/createSimpleUserRequest';
import { updateSimpleUserRequestSchema } from '@repo/contracts/schemas/user/updateSimpleUserRequest';
import { updateUserRolesReqSchema } from '@repo/contracts/schemas/user/updateUserRolesReq';
import { Response } from 'express';
import { UserAppService } from './user.app.service';

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
    const input = updateSimpleUserRequestSchema.parse(req.body);
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const userId = getUrlParam(req, 'userId', { uuid: true });
    const result = await this.userService.updateSimpleUser({ schoolId, userId, input });
    res.status(200).json(result);
  };

  getUserRoles = async (req: AuthenticatedRequest, res: Response) => {
    const userId = getUrlParam(req, 'userId', { uuid: true });
    const result = await this.userService.getUserRoles(userId);
    res.status(200).json({
      message: 'User roles fetched successfully',
      data: result,
    });
  };

  updateUserRoles = async (req: AuthenticatedRequest, res: Response) => {
    const userId = getUrlParam(req, 'userId', { uuid: true });
    const input = updateUserRolesReqSchema.parse(req.body);
    const result = await this.userService.updateUserRoles({ userId, input });
    res.status(200).json({
      message: 'User roles updated successfully',
      data: result,
    });
  };

  deleteUser = async (req: AuthenticatedRequest, res: Response) => {
    const userId = getUrlParam(req, 'userId', { uuid: true });
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const result = await this.userService.deleteUser({ userId, schoolId });
    res.status(200).json({
      message: 'User deleted successfully',
      data: result,
    });
  };
}
