import { AuthenticatedRequest } from '@/types/auth/AuthenticatedRequest';
import getUrlParam from '@/utils/getUrlParam';
import { createStaffRequestSchema } from '@repo/contracts/schemas/staff/createStaffRequest';
import { updateStaffRequestSchema } from '@repo/contracts/schemas/staff/updateStaffRequest';
import { Response } from 'express';
import { CreateSimpleUserUseCase } from '../User/use-cases/createSimpleUser.use-case';
import { StaffService } from './staff.service';
import { staffQueryParams } from '@repo/contracts/schemas/staff/staffQueryParams';

export class StaffController {
  constructor(
    private readonly staffService: StaffService,
    private readonly createSimpleUserUseCase: CreateSimpleUserUseCase,
  ) {}

  create = async (req: AuthenticatedRequest, res: Response) => {
    const input = createStaffRequestSchema.parse(req.body);
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const { user, isAccountExist } = await this.createSimpleUserUseCase.execute({ input, schoolId });
    res.status(201).json({
      message: 'Staff created successfully',
      staff: { id: user.id },
      accountExists: isAccountExist,
    });
  };

  update = async (req: AuthenticatedRequest, res: Response) => {
    const input = updateStaffRequestSchema.parse(req.body);
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const staffId = getUrlParam(req, 'staffId', { uuid: true });
    const result = await this.staffService.updateSimpleStaff({ input, staffId, schoolId });
    res.status(200).json({
      message: 'Staff updated successfully',
      staff: { id: result.id },
    });
  };

  getById = async (req: AuthenticatedRequest, res: Response) => {
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const staffId = getUrlParam(req, 'staffId', { uuid: true });
    const result = await this.staffService.findById({ staffId, schoolId });
    res.status(200).json({
      message: 'Staff fetched successfully',
      staff: result,
    });
  };

  findAll = async (req: AuthenticatedRequest, res: Response) => {
    const schoolId = getUrlParam(req, 'schoolId', { uuid: true });
    const query = staffQueryParams.schema.parse(req.query);
    const result = await this.staffService.findAll({ query, schoolId });
    res.status(200).json({
      message: 'Staff fetched successfully',
      staff: result,
    });
  };
}
