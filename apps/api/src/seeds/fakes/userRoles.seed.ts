import { UserRole } from '@repo/db/prisma/enums';
import { UserRoleService } from '@/modules/userRoles/userRole.service';
import { TX } from '@/types/prisma/PrismaTransaction';

export class UserRolesSeed {
  constructor(private readonly userRoleService: UserRoleService) {}
  run = async (params: { userId: string; role: UserRole }, tx?: TX) => {
    const { userId, role } = params;
    await this.userRoleService.grantRole_V2({ userId, role }, tx);
  };
}
