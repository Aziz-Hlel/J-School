import { CreateSimpleUserUseCase } from '@/modules/User/use-cases/createSimpleUser.use-case';
import { TeacherService } from '../teacher.service';
import { CreateTeacherRequest } from '@repo/contracts/schemas/teacher/createTeacherRequest';
import { UserRole } from '@repo/db/prisma/enums';
import { prisma } from '@/bootstrap/db.init';

export class CreateTeacherUseCase {
  constructor(
    private readonly teacherService: TeacherService,
    private readonly createSimpleUserUseCase: CreateSimpleUserUseCase,
  ) {}

  execute = async ({ input, schoolId }: { input: CreateTeacherRequest; schoolId: string }) => {
    return await prisma.$transaction(async (tx) => {
      const createdUser = await this.createSimpleUserUseCase.execute(
        {
          input: {
            ...input,
            role: UserRole.TEACHER,
          },
          schoolId,
        },
        tx,
      );
      const createdTeacher = await this.teacherService.create({ userId: createdUser.user.id }, tx);
      return { user: createdUser.user, teacher: createdTeacher, isAccountExist: createdUser.isAccountExist };
    });
  };
}
