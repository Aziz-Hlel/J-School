import { UserRole } from '@repo/db/prisma/enums';
import { TeacherSeed } from './teacher.seed';
import { UserRolesSeed } from './userRoles.seed';
import { TX } from '@/types/prisma/PrismaTransaction';
import { ParentSeed } from './parent.seed';

export class ActorSeed {
  constructor(
    private readonly userRolesSeed: UserRolesSeed,
    private readonly teacherSeed: TeacherSeed,
    private readonly parentSeed: ParentSeed,
  ) {}
  run = async (params: { role: UserRole; userId: string }, tx?: TX) => {
    const { role, userId } = params;
    switch (role) {
      case UserRole.NURSE:
      case UserRole.DRIVER:
      case UserRole.DIRECTOR:
      case UserRole.MANAGER:
        await this.userRolesSeed.run({ role, userId }, tx);
        break;
      case UserRole.TEACHER:
        await this.userRolesSeed.run({ role, userId }, tx);
        return { type: UserRole.TEACHER, data: await this.teacherSeed.run({ userId }, tx) } as const;
      case UserRole.PARENT:
        await this.userRolesSeed.run({ role, userId }, tx);
        return { type: UserRole.PARENT, data: await this.parentSeed.run({ userId }, tx) } as const;

      default:
        break;
    }
  };
}
