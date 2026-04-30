import { GrantSimpleRoleRequest } from '@repo/contracts/schemas/userRole/grantSimpleRoleRequest';
import { UserRoleService } from './userRole.service';

export class UserRoleAppService {
  constructor(private readonly userRoleService: UserRoleService) {}

  grantSimpleRole = async ({ validatedInput, userId }: { validatedInput: GrantSimpleRoleRequest; userId: string }) => {
    const response = await this.userRoleService.grantSimpleRole({
      userId,
      role: validatedInput.role,
    });
    return {
      success: true,
      message: 'Role granted successfully',
    };
  };

  revokeSimpleRole = async ({ validatedInput, userId }: { validatedInput: GrantSimpleRoleRequest; userId: string }) => {
    const response = await this.userRoleService.revokeSimpleRole({
      userId,
      role: validatedInput.role,
    });
    return {
      success: true,
      message: 'Role revoked successfully',
    };
  };
}
