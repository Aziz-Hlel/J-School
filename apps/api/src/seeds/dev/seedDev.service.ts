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
import {
  announcementSeedData,
  classroomsSeedData,
  reactionSeedData,
  studentClassroomAssignmentSeedData,
  subjectsWithExamsSeedData,
  teacherAssignmentSeedData,
  teacherSeedData,
  timeTableSeedData,
} from './dataV2';
import { TimetableSeed } from '../fakes/timtable.seed';
import { TeacherSeed } from '../fakes/teacher.seed';
import { MediaSeedV2 } from '../fakes/media.seed2';
import { AnnouncementSeed } from '../fakes/announcement.seed';
import { ReactionSeed } from '../fakes/reaction.seed';

faker.seed(1); // Ensure consistent fake data across runs

export class SeedDevService implements ISeed {
  constructor(
    private readonly accountSeed: AccountSeed,
    private readonly ownerSeed: OwnerSeed,
    private readonly schoolSeed: SchoolSeed,
    private readonly userSeed: UserSeed,
    private readonly actorSeed: ActorSeed,
    private readonly teacherSeed: TeacherSeed,
    private readonly studentSeed: StudentSeed,
    private readonly parentStudentSeed: ParentStudentSeed,
    private readonly classroomSeed: ClassroomSeed2,
    private readonly subjectAndExamsSeed: SubjectAndExamsSeed2,
    private readonly assignmentSeed: AssignmentSeed,
    private readonly timetableSeed: TimetableSeed,
    private readonly mediaSeed: MediaSeedV2,
    private readonly announcementSeed: AnnouncementSeed,
    private readonly reactionSeed: ReactionSeed,
  ) {}

  private seedClassroom = async ({ schoolId }: { schoolId: string }) => {
    const classrooms = await Promise.all(
      Object.values(classroomsSeedData).map((classroom) =>
        this.classroomSeed.run({ schoolId, input: { grade: classroom.grade, name: classroom.name } }),
      ),
    );
    return classrooms;
  };

  private seedSubjectAndExams = async ({ schoolId }: { schoolId: string }) => {
    const subjects = await Promise.all(
      Object.values(subjectsWithExamsSeedData).flatMap((data) =>
        Object.values(data.subjectsWithExams).map((SubjectData) =>
          this.subjectAndExamsSeed.run({
            schoolId,
            input: SubjectData.subject,
            grade: data.grade,
            exams: SubjectData.exams,
          }),
        ),
      ),
    );
    return subjects;
  };

  private seedAssignment = async ({ schoolId }: { schoolId: string }) => {
    const subjects = await this.seedSubjectAndExams({ schoolId });
    const classrooms = await this.seedClassroom({ schoolId });
    await Promise.all(
      classrooms.map(async (classroom) =>
        subjects.map(async (subject) =>
          this.assignmentSeed.run({
            schoolId,
            input: {
              classroomId: classroom.id,
              subjectId: subject.id,
            },
          }),
        ),
      ),
    );
  };

  private seedTimetable = async ({ schoolId }: { schoolId: string }) => {
    await Promise.all(
      Object.values(timeTableSeedData).map((timetableData) => {
        const grade = classroomsSeedData[timetableData.classroomName].grade;
        timetableData.timetable.map((time) => {
          this.timetableSeed.run({
            schoolId,
            subjectNameEn: time.subjectNameEn,
            classroomName: timetableData.classroomName,
            grade,
            timetable: time,
          });
        });
      }),
    );
  };

  private seedTeachers = async ({ schoolId }: { schoolId: string }) => {
    await Promise.all(
      Object.values(teacherSeedData).map(async (teacher) => {
        const { account } = await this.accountSeed.run({
          email: teacher.email,
          accountRole: AccountRole.USER,
        });

        const user = await this.userSeed.run({
          accountId: account.id,
          schoolId,
        });

        await this.actorSeed.run({ role: UserRole.TEACHER, userId: user.id });
      }),
    );
  };

  private seedAnnouncements = async ({ schoolId }: { schoolId: string }) => {
    await Promise.all(
      Object.values(announcementSeedData).map(async (accouncementSeed) => {
        const medias = await Promise.all(accouncementSeed.content.map((type) => this.mediaSeed.run({ type })));
        const mediaIds = medias.map((media) => media.id);
        await this.announcementSeed.run({
          schoolId,
          description: accouncementSeed.description,
          mediaIds,
          createdAt: accouncementSeed.createdAt,
        });
      }),
    );
  };

  private addTeacherToAssignment = async ({ schoolId }: { schoolId: string }) => {
    await Promise.all(
      Object.values(teacherAssignmentSeedData).map(async (teacherAssignment) => {
        await this.teacherSeed.addToAssignment({
          schoolId,
          teacherEmail: teacherAssignment.teacherEmail,
          classroomName: teacherAssignment.classroomName,
          subjectNameEn: teacherAssignment.subjectNameEn,
          grade: teacherAssignment.grade,
        });
      }),
    );
  };

  private assignStudentsToClassroom = async ({ schoolId }: { schoolId: string }) => {
    studentClassroomAssignmentSeedData.map(async (assignment) => {
      await this.studentSeed.assignStudentToClassroom({
        schoolId,
        studentUids: assignment.students.map((s) => s.uid),
        classroom: {
          name: assignment.classroom.name,
          grade: assignment.classroom.grade,
        },
      });
    });
  };

  private seedReactions = async ({ schoolId }: { schoolId: string }) => {
    await Promise.all(
      reactionSeedData.flatMap(async (reactionSeed) => {
        reactionSeed.reactions.map(async (reaction) => {
          await this.reactionSeed.run({
            schoolId,
            announcementCreation: reactionSeed.announcement.createdAt,
            accountEmail: reaction.accountEmail,
            reactionType: reaction.type,
          });
        });
      }),
    );
  };

  run = async () => {
    data.forEach(async (tenant) => {
      const { account } = await this.accountSeed.run({ email: tenant.account.email, accountRole: AccountRole.ADMIN });
      const { owner } = await this.ownerSeed.run({ accountId: account.id });
      const school = await this.schoolSeed.run({ ownerId: owner.id });

      await this.seedSubjectAndExams({ schoolId: school.id });

      await this.seedClassroom({ schoolId: school.id });

      await this.seedAssignment({ schoolId: school.id });

      await this.seedTimetable({ schoolId: school.id });

      await this.seedTeachers({ schoolId: school.id });

      await this.addTeacherToAssignment({ schoolId: school.id });

      await this.assignStudentsToClassroom({ schoolId: school.id });

      await this.seedAnnouncements({ schoolId: school.id });

      await this.seedReactions({ schoolId: school.id });

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
