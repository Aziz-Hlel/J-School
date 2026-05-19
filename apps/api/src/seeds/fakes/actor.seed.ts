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

  runV2 = async (
    params:
      | {
          role: typeof UserRole.DIRECTOR | typeof UserRole.MANAGER | typeof UserRole.NURSE | typeof UserRole.DRIVER;
          userId: string;
        }
      | {
          role: typeof UserRole.TEACHER;
          userId: string;
          teacherId: string;
        }
      | {
          role: typeof UserRole.PARENT;
          userId: string;
          parentId: string;
        },
    tx?: TX,
  ) => {
    const { role, userId } = params;
    switch (role) {
      case UserRole.NURSE:
      case UserRole.DRIVER:
      case UserRole.DIRECTOR:
      case UserRole.MANAGER:
        await this.userRolesSeed.runV2({ role, userId }, tx);
        break;
      case UserRole.TEACHER:
        await this.userRolesSeed.runV2({ role, userId }, tx);
        const teacher = await this.teacherSeed.runV2({ userId, teacherId: params.teacherId }, tx);
        return { type: UserRole.TEACHER, data: teacher } as const;
      case UserRole.PARENT:
        await this.userRolesSeed.runV2({ role, userId }, tx);
        const parent = await this.parentSeed.runV2({ userId, parentId: params.parentId }, tx);
        return { type: UserRole.PARENT, data: parent } as const;

      default:
        throw new Error(`Role ${role} not supported in ActorSeed`);
    }
  };
}
