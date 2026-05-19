import { UserRole } from '@repo/db/prisma/enums';
import { UserRoleService } from '@/modules/userRoles/userRole.service';
import { TX } from '@/types/prisma/PrismaTransaction';
import prisma from '@repo/db';

export class UserRolesSeed {
  constructor(private readonly userRoleService: UserRoleService) {}
  run = async (params: { userId: string; role: UserRole }, tx?: TX) => {
    const { userId, role } = params;
    await this.userRoleService.grantRole_V2({ userId, role }, tx);
  };

  runV2 = async (params: { userId: string; role: UserRole }, tx?: TX) => {
    const { userId, role } = params;
    const client = tx ?? prisma;
    await client.userRoles.upsert({
      where: {
        userId_role: {
          userId,
          role,
        },
      },
      update: {},
      create: {
        userId,
        role,
      },
    });
  };
}
