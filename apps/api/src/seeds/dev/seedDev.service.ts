import { AccountRole, UserRole } from '@repo/db/prisma/enums';
import { faker } from '@faker-js/faker';
import { AccountSeed } from '../fakes/account.seed';
import { ActorSeed } from '../fakes/actor.seed';
import { OwnerSeed } from '../fakes/owner.seed';
import { SchoolSeed } from '../fakes/school.seed';
import { UserSeed } from '../fakes/users.fake';
import ISeed from '../ISeed';
import { data } from './data';
import { StudentSeed } from '../fakes/student.seed';
import { ParentStudentSeed } from '../fakes/parentStudent.seed';
import { ClassroomSeed } from '../fakes/classroom.seed';
import { SubjectSeed } from '../fakes/subject.seed';

faker.seed(1); // Ensure consistent fake data across runs
export class SeedDevService implements ISeed {
  constructor(
    private readonly accountSeed: AccountSeed,
    private readonly ownerSeed: OwnerSeed,
    private readonly schoolSeed: SchoolSeed,
    private readonly userSeed: UserSeed,
    private readonly actorSeed: ActorSeed,
    private readonly studentSeed: StudentSeed,
    private readonly parentStudentSeed: ParentStudentSeed,
    private readonly classroomSeed: ClassroomSeed,
    private readonly subjectSeed: SubjectSeed,
  ) {}

  generateFakeAccountWithRoleUser = (index: number) => {
    return {
      email: `user${index}@gmail.com`,
      password: '12345678',
      displayName: `user${index}`,
      role: AccountRole.USER,
    };
  };

  run = async () => {
    data.forEach(async (tenant) => {
      const { account } = await this.accountSeed.run({ email: tenant.account.email, accountRole: AccountRole.ADMIN });
      const { owner } = await this.ownerSeed.run({ accountId: account.id });
      const school = await this.schoolSeed.run({ ownerId: owner.id });

      await this.classroomSeed.run({ schoolId: school.id });
      await this.subjectSeed.run({ schoolId: school.id, input: tenant.subjects });
      tenant.users.forEach(async (userInfo) => {
        const { account } = await this.accountSeed.run({
          email: userInfo.email,
          accountRole: AccountRole.USER,
        });

        const user = await this.userSeed.run({
          accountId: account.id,
          schoolId: school.id,
        });

        const response = await this.actorSeed.run({ role: userInfo.role, userId: user.id });
        if (response?.type === UserRole.PARENT && userInfo.role === UserRole.PARENT) {
          const parent = response.data;
          userInfo.students.forEach(async (studentInfo) => {
            const student = await this.studentSeed.run({ schoolId: school.id, student: studentInfo });
            await this.parentStudentSeed.run({ parentId: parent.id, studentId: student.id });
          });
        }
      });
    });
  };
}
