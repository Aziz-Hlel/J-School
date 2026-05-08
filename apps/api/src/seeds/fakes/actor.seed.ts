import { TX } from '@/types/prisma/PrismaTransaction';
import { UserRole } from '@repo/db/prisma/enums';
import { ParentSeed } from './parent.seed';
import { TeacherSeed } from './teacher.seed';
import { UserRolesSeed } from './userRoles.seed';

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
        const teacher = await this.teacherSeed.run({ userId }, tx);
        return { type: UserRole.TEACHER, data: teacher } as const;
      case UserRole.PARENT:
        await this.userRolesSeed.run({ role, userId }, tx);
        const parent = await this.parentSeed.run({ userId }, tx);
        return { type: UserRole.PARENT, data: parent } as const;

      default:
        throw new Error(`Role ${role} not supported in ActorSeed`);
    }
  };
}
