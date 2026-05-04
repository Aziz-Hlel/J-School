import { faker } from '@faker-js/faker';
import { AccountRole, UserRole } from '@repo/db/prisma/enums';
import { AccountSeed } from '../fakes/account.seed';
import { ActorSeed } from '../fakes/actor.seed';
import { AssignmentSeed } from '../fakes/assignment.seed';
import { ClassroomSeed2 } from '../fakes/classroom.seed2';
import { OwnerSeed } from '../fakes/owner.seed';
import { ParentStudentSeed } from '../fakes/parentStudent.seed';
import { SchoolSeed } from '../fakes/school.seed';
import { StudentSeed } from '../fakes/student.seed';
import { SubjectAndExamsSeed2 } from '../fakes/subject.seed2';
import { UserSeed } from '../fakes/users.fake';
import ISeed from '../ISeed';
import { data } from './data';

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
    private readonly classroomSeed: ClassroomSeed2,
    private readonly subjectAndExamsSeed: SubjectAndExamsSeed2,
    private readonly assignmentSeed: AssignmentSeed,
  ) {}

  run = async () => {
    data.forEach(async (tenant) => {
      const { account } = await this.accountSeed.run({ email: tenant.account.email, accountRole: AccountRole.ADMIN });
      const { owner } = await this.ownerSeed.run({ accountId: account.id });
      const school = await this.schoolSeed.run({ ownerId: owner.id });

      Object.values(tenant.data).forEach(async (gradeData) => {
        const subjects = await Promise.all(
          Object.values(gradeData.subjects_with_exams).map(async (SubjectData) => {
            return this.subjectAndExamsSeed.run({
              schoolId: school.id,
              input: SubjectData.subject,
              grade: gradeData.grade,
              exams: SubjectData.exams,
            });
          }),
        );

        const classrooms = await Promise.all(
          gradeData.classrooms.map((classroom) =>
            this.classroomSeed.run({ schoolId: school.id, input: { grade: gradeData.grade, name: classroom } }),
          ),
        );

        await Promise.all(
          classrooms.map(async (classroom) => {
            subjects.forEach(async (subject) => {
              return await this.assignmentSeed.run({
                schoolId: school.id,
                input: {
                  classroomId: classroom.id,
                  subjectId: subject.id,
                },
              });
            });
          }),
        );
      });

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
