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
import { classroomsSeedData, subjectsWithExamsSeedData, timeTableSeedData } from './dataV2';
import { TimetableSeed } from '../fakes/timtable.seed';

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
    private readonly timetableSeed: TimetableSeed,
  ) {}

  run = async () => {
    data.forEach(async (tenant) => {
      const { account } = await this.accountSeed.run({ email: tenant.account.email, accountRole: AccountRole.ADMIN });
      const { owner } = await this.ownerSeed.run({ accountId: account.id });
      const school = await this.schoolSeed.run({ ownerId: owner.id });

      const subjects = await Promise.all(
        Object.values(subjectsWithExamsSeedData).flatMap((data) =>
          Object.values(data.subjectsWithExams).map((SubjectData) =>
            this.subjectAndExamsSeed.run({
              schoolId: school.id,
              input: SubjectData.subject,
              grade: data.grade,
              exams: SubjectData.exams,
            }),
          ),
        ),
      );

      const classrooms = await Promise.all(
        Object.values(classroomsSeedData).map((classroom) =>
          this.classroomSeed.run({ schoolId: school.id, input: { grade: classroom.grade, name: classroom.name } }),
        ),
      );

      await Promise.all(
        classrooms.map(async (classroom) =>
          subjects.map(async (subject) =>
            this.assignmentSeed.run({
              schoolId: school.id,
              input: {
                classroomId: classroom.id,
                subjectId: subject.id,
              },
            }),
          ),
        ),
      );

      await Promise.all(
        Object.values(timeTableSeedData).map((timetableData) => {
          const grade = classroomsSeedData[timetableData.classroomName].grade;
          timetableData.timetable.map((time) => {
            this.timetableSeed.run({
              schoolId: school.id,
              subjectNameEn: time.subjectNameEn,
              classroomName: timetableData.classroomName,
              grade,
              timetable: time,
            });
          });
        }),
      );

      tenant.users.forEach(async (userInfo) => {
        const { account } = await this.accountSeed.run({
          email: userInfo.email,
          accountRole: AccountRole.USER,
        });

        const user = await this.userSeed.run({
          accountId: account.id,
          schoolId: school.id,
        });

        await this.actorSeed.run({ role: userInfo.role, userId: user.id });
      });

      tenant.parentsWithStudents.forEach(async (parentInfo) => {
        const { account } = await this.accountSeed.run({
          email: parentInfo.email,
          accountRole: AccountRole.USER,
        });

        const user = await this.userSeed.run({
          accountId: account.id,
          schoolId: school.id,
        });

        const response = await this.actorSeed.run({ role: parentInfo.role, userId: user.id });
        if (response?.type === UserRole.PARENT && parentInfo.role === UserRole.PARENT) {
          const parent = response.data;
          parentInfo.students.forEach(async (studentInfo) => {
            const student = await this.studentSeed.run({ schoolId: school.id, student: studentInfo });
            await this.parentStudentSeed.run({ parentId: parent.id, studentId: student.id });
          });
        }
      });
    });
  };
}
