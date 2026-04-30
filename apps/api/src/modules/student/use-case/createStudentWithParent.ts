import { prisma } from '@/bootstrap/db.init';
import { NotFoundError } from '@/err/service/customErrors';
import { User, UserRole } from '@repo/db/prisma/client';
import { ParentRepo } from '@/modules/parent/parent.repo';
import { ParentService } from '@/modules/parent/parent.service';
import { ParentStudentService } from '@/modules/ParentStudent/parentStudent.service';
import { CreateSimpleUserUseCase } from '@/modules/User/use-cases/createSimpleUser.use-case';
import { UserRepo } from '@/modules/User/user.repo';
import { UserRoleService } from '@/modules/userRoles/userRole.service';
import { CreateStudentWithParentRequest } from '@repo/contracts/schemas/student/withParent/createWithParent';
import { StudentRepo } from '../student.repo';

export class CreateStudentWithParentUseCase {
  constructor(
    private readonly userRepo: UserRepo,
    private readonly studentRepo: StudentRepo,
    private readonly parentRepo: ParentRepo,
    private readonly createSimpleUserUseCase: CreateSimpleUserUseCase,
    private readonly parentStudentService: ParentStudentService,
    private readonly parentService: ParentService,
    private readonly userRoleService: UserRoleService,
  ) {}

  execute = async (params: { input: CreateStudentWithParentRequest; schoolId: string }) => {
    const { input, schoolId } = params;

    return await prisma.$transaction(async (tx) => {
      let user: User;
      let parentId: string;
      let isAccountExist = input.parent.type === 'NEW';

      if (input.parent.type === 'NEW') {
        const { user: createdUser, isAccountExist: accountExist } = await this.createSimpleUserUseCase.execute(
          {
            input: {
              email: input.parent.email,
              password: input.parent.password,
              firstName: input.parent.firstName,
              lastName: input.parent.lastName,
              cin: input.parent.cin,
              phone: input.parent.phone,
              gender: input.parent.gender,
              dateOfBirth: input.parent.dateOfBirth,
              address: input.parent.address,
              role: UserRole.PARENT,
            },
            schoolId,
          },
          tx,
        );
        user = createdUser;
        isAccountExist = accountExist;
        const parent = await this.parentRepo.create(
          {
            input: {
              emergencyPhone: input.parent.emergencyPhone,
            },
            userId: user.id,
            schoolId,
          },
          tx,
        );
        parentId = parent.id;
      } else {
        const user = await this.userRepo.findById(input.parent.id, { parent: true });

        if (!user) {
          throw new NotFoundError('Parent not found');
        }
        if (user.parent) {
          parentId = user.parent.id;
        } else {
          const { parent, type } = await this.parentService.findOrCreate(
            {
              input: {
                emergencyPhone: null,
              },
              userId: user.id,
              schoolId,
            },
            tx,
          );
          parentId = parent.id;

          if (type === 'NEW') {
            await this.userRoleService.grantRole_V2(
              {
                userId: user.id,
                role: UserRole.PARENT,
              },
              tx,
            );
          }
        }
      }

      const student = await this.studentRepo.create(
        {
          input: {
            firstName: input.firstName,
            uid: input.uid,
            avatarId: input.avatarId,
            lastName: input.lastName,
            gender: input.gender,
            dateOfBirth: input.dateOfBirth,
            status: input.status,
          },
          schoolId,
        },
        tx,
      );

      await this.parentStudentService.assignStudentToParent(
        {
          studentId: student.id,
          parentId,
          schoolId,
        },
        tx,
      );

      return { student, parentId, isAccountExist };
    });
  };
}
