import { faker } from '@faker-js/faker';
import { AccountRole } from '@repo/db/prisma/enums';
import { AccountSeed } from '../fakes/account.seed';
import { ActorSeed } from '../fakes/actor.seed';
import { AnnouncementSeed } from '../fakes/announcement.seed';
import { AssignmentSeed } from '../fakes/assignment.seed';
import { ClassroomSeed2 } from '../fakes/classroom.seed2';
import { ExtracurricularSeed } from '../fakes/extraCurricular.seed';
import { ExtraCurricularSessionsSeed } from '../fakes/extraCurricularSessions.seed';
import { FeeSeed } from '../fakes/fee.seed';
import { FeeItemSeed } from '../fakes/feeItem.seed';
import { HomeworkSeed } from '../fakes/homework.seed';
import { MediaSeedV2 } from '../fakes/media.seed2';
import { OwnerSeed } from '../fakes/owner.seed';
import { ParentSeed } from '../fakes/parent.seed';
import { ParentStudentSeed } from '../fakes/parentStudent.seed';
import { PostSeed } from '../fakes/post.seed';
import { ReactionSeed } from '../fakes/reaction.seed';
import { SchoolSeed } from '../fakes/school.seed';
import { StudentSeed } from '../fakes/student.seed';
import { SubjectAndExamsSeed2 } from '../fakes/subject.seed2';
import { TeacherSeed } from '../fakes/teacher.seed';
import { TimetableSeed } from '../fakes/timtable.seed';
import { UserSeed } from '../fakes/users.fake';
import ISeed from '../ISeed';
import { parentSeedData, parentStudentSeedData, studentSeedData, teacherSeedData, userSeedData } from './actors';
import { data } from './data';
import {
  announcementSeedData,
  classroomsSeedData,
  extraCurricularAssignmentSeedData,
  extraCurricularSeedData,
  extraCurricularSessionSeedData,
  extraCurricularStudentAssignmentSeedData,
  homeworkSeedData,
  postsSeedData,
  reactionSeedData,
  studentClassroomAssignmentSeedData,
  subjectsWithExamsSeedData,
  teacherAssignmentSeedData,
  timeTableSeedData,
} from './dataV2';
import { feeItemsSeedData, feesSeedData } from './feeItems.seed.data';

faker.seed(1); // Ensure consistent fake data across runs

export class SeedDevService implements ISeed {
  constructor(
    private readonly accountSeed: AccountSeed,
    private readonly ownerSeed: OwnerSeed,
    private readonly schoolSeed: SchoolSeed,
    private readonly userSeed: UserSeed,
    private readonly actorSeed: ActorSeed,
    private readonly teacherSeed: TeacherSeed,
    private readonly parentSeed: ParentSeed,
    private readonly studentSeed: StudentSeed,
    private readonly parentStudentSeed: ParentStudentSeed,
    private readonly classroomSeed: ClassroomSeed2,
    private readonly subjectAndExamsSeed: SubjectAndExamsSeed2,
    private readonly assignmentSeed: AssignmentSeed,
    private readonly timetableSeed: TimetableSeed,
    private readonly mediaSeed: MediaSeedV2,
    private readonly announcementSeed: AnnouncementSeed,
    private readonly reactionSeed: ReactionSeed,
    private readonly extraCurricularSeed: ExtracurricularSeed,
    private readonly extraCurricularSessionsSeed: ExtraCurricularSessionsSeed,
    private readonly postSeed: PostSeed,
    private readonly feeSeed: FeeSeed,
    private readonly feeItemSeed: FeeItemSeed,
    private readonly homeworkSeed: HomeworkSeed,
  ) {}

  private seedAccounts = async () => {
    const actorsList = [
      ...Object.values(userSeedData),
      ...Object.values(parentSeedData),
      ...Object.values(teacherSeedData),
    ];
    await Promise.all(
      actorsList.map(async (actor) => {
        await this.accountSeed.run({
          email: actor.email,
          accountRole: AccountRole.USER,
        });
      }),
    );
  };

  private seedUsers = async ({ schoolId }: { schoolId: string }) => {
    const usersList = [
      ...Object.values(userSeedData),
      ...Object.values(parentSeedData),
      ...Object.values(teacherSeedData),
    ];
    await Promise.all(
      usersList.map(async (user) => {
        await this.userSeed.runV2({ accountEmail: user.email, schoolId, userId: user.id });
      }),
    );
  };

  private seedUserRoles = async () => {
    await Promise.all(
      Object.values(userSeedData).map(async (user) => {
        await this.actorSeed.runV2({ role: user.role, userId: user.id });
      }),
    );
  };

  private seedTeachers = async () => {
    await Promise.all(
      Object.values(teacherSeedData).map(async (teacher) => {
        await this.actorSeed.runV2({ role: teacher.role, teacherId: teacher.id, userId: teacher.userId });
      }),
    );
  };

  private seedParents = async () => {
    await Promise.all(
      Object.values(parentSeedData).map(async (parent) => {
        await this.actorSeed.runV2({ role: parent.role, userId: parent.userId, parentId: parent.id });
      }),
    );
  };

  private seedParentStudentsAssignment = async () => {
    await Promise.all(
      Object.values(parentStudentSeedData).map(async (assignment) => {
        await this.parentStudentSeed.runV2({ parentId: assignment.parentId, studentId: assignment.studentId });
      }),
    );
  };

  private seedStudents = async ({ schoolId }: { schoolId: string }) => {
    await Promise.all(
      Object.values(studentSeedData).map(async (student) => {
        await this.studentSeed.runV2({ student, schoolId });
      }),
    );
  };

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

  private seedAnnouncements = async ({ schoolId }: { schoolId: string }) => {
    await Promise.all(
      Object.values(announcementSeedData).map(async (accouncementSeed) => {
        const medias = await Promise.all(accouncementSeed.content.map((type) => this.mediaSeed.run({ type })));
        const mediaIds = medias.map((media) => media.id);
        await this.announcementSeed.run({
          id: accouncementSeed.id,
          title: accouncementSeed.title,
          description: accouncementSeed.description,
          mediaIds,
          schoolId,
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
            announcementId: reactionSeed.announcement.id,
            accountEmail: reaction.accountEmail,
            reactionType: reaction.type,
          });
        });
      }),
    );
  };

  private seedExtraCurricular = async ({ schoolId }: { schoolId: string }) => {
    await Promise.all(
      Object.values(extraCurricularSeedData).map(async (extraCurricularSeed) => {
        await this.extraCurricularSeed.run({
          schoolId,
          id: extraCurricularSeed.id,
          name: extraCurricularSeed.name,
          grade: extraCurricularSeed.grade,
        });
      }),
    );
  };

  private assignTeacherToExtraCurricular = async ({ schoolId }: { schoolId: string }) => {
    await Promise.all(
      Object.values(extraCurricularAssignmentSeedData).map(async (extraCurricularAssignment) => {
        await this.extraCurricularSeed.assignTeacher({
          schoolId,
          teacherEmail: extraCurricularAssignment.teacher.email,
          extraCurricularId: extraCurricularAssignment.extraCurricular.id,
        });
      }),
    );
  };

  private seedExtraCurricularSessions = async () => {
    await Promise.all(
      Object.values(extraCurricularSessionSeedData).map(async (extraCurricularSession) => {
        await this.extraCurricularSessionsSeed.run({
          id: extraCurricularSession.id,
          day: extraCurricularSession.day,
          date: extraCurricularSession.date,
          startTime: extraCurricularSession.startTime,
          endTime: extraCurricularSession.endTime,
          type: extraCurricularSession.type,
          extraCurricularId: extraCurricularSession.extraCurricularId,
        });
      }),
    );
  };

  private seedExtraCurricularPosts = async ({ schoolId }: { schoolId: string }) => {
    for (const post of Object.values(postsSeedData)) {
      const medias = await Promise.all(post.medias.map((type) => this.mediaSeed.run({ type })));

      await this.postSeed.run({
        schoolId,
        id: post.id,
        content: post.content,
        mediaIds: medias.map((m) => m.id),
        extraCurricularId: post.extraCurricular.id,
      });

      // small delay to separate DB calls
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  };

  private seedExtraCurricularStudents = async ({ schoolId }: { schoolId: string }) => {
    await Promise.all(
      Object.values(extraCurricularStudentAssignmentSeedData).map(async (extraCurricularStudentAssignment) => {
        await this.extraCurricularSeed.assignStudent({
          schoolId,
          extraCurricularId: extraCurricularStudentAssignment.extraCurricularId,
          studentId: extraCurricularStudentAssignment.studentId,
        });
      }),
    );
  };

  private seedFees = async ({ schoolId }: { schoolId: string }) => {
    await Promise.all(
      Object.values(feesSeedData).map(async (fee) => {
        await this.feeSeed.run({
          schoolId,
          id: fee.id,
          studentId: fee.studentId,
          name: fee.name,
          startDate: fee.startDate,
          endDate: fee.endDate,
        });
      }),
    );
  };

  private seedFeeItems = async ({ schoolId }: { schoolId: string }) => {
    const allFeeItems = Object.values(feeItemsSeedData).flat();
    await Promise.all(
      allFeeItems.map((feeItem) =>
        this.feeItemSeed.run({
          schoolId,
          id: feeItem.id,
          feeId: feeItem.feeId,
          title: feeItem.title,
          description: feeItem.description,
          amount: feeItem.amount,
        }),
      ),
    );
  };

  private seedHomework = async ({ schoolId }: { schoolId: string }) => {
    await Promise.all(
      homeworkSeedData.map(async (homeworkData) => {
        const fileIds = await Promise.all(homeworkData.files.map((type) => this.mediaSeed.run({ type })));
        await this.homeworkSeed.run({
          id: homeworkData.id,
          schoolId,
          classroomName: homeworkData.assignment.classroomName,
          grade: homeworkData.assignment.grade,
          subjectNameEn: homeworkData.assignment.subjectNameEn,
          title: homeworkData.title,
          content: homeworkData.content,
          fileIds: fileIds.map((file) => file.id),
          due: homeworkData.due,
          studentIds: homeworkData.students.map((student) => student.id),
        });
      }),
    );
  };

  // private seedTeacherComments = async ({ schoolId }: { schoolId: string }) => {
  //   await Promise.all(
  //     teacherCommentsSeedData.map(async (teacherComment) => {
  //       await this.teacherCommentSeed.run({
  //         schoolId,
  //         id: teacherComment.id,
  //         studentId: teacherComment.student.id,
  //         teacherId: teacherComment.teacher.id,
  //         title: teacherComment.title,
  //         content: teacherComment.content,
  //         parentReply: teacherComment.parentReply,
  //       });
  //     }),
  //   );
  // };

  run = async () => {
    data.forEach(async (tenant) => {
      const { account } = await this.accountSeed.run({ email: tenant.account.email, accountRole: AccountRole.ADMIN });
      const { owner } = await this.ownerSeed.run({ accountId: account.id });
      const school = await this.schoolSeed.run({ ownerId: owner.id });

      await this.seedAccounts();

      await this.seedUsers({ schoolId: school.id });

      await this.seedUserRoles();

      await this.seedTeachers();

      await this.seedParents();

      await this.seedStudents({ schoolId: school.id });

      await this.seedParentStudentsAssignment();

      await this.seedSubjectAndExams({ schoolId: school.id });

      await this.seedClassroom({ schoolId: school.id });

      await this.seedAssignment({ schoolId: school.id });

      await this.seedTimetable({ schoolId: school.id });

      await this.addTeacherToAssignment({ schoolId: school.id });

      await this.assignStudentsToClassroom({ schoolId: school.id });

      await this.seedAnnouncements({ schoolId: school.id });

      await this.seedReactions({ schoolId: school.id });

      await this.seedExtraCurricular({ schoolId: school.id });

      await this.assignTeacherToExtraCurricular({ schoolId: school.id });

      await this.seedExtraCurricularStudents({ schoolId: school.id });

      await this.seedExtraCurricularSessions();

      await this.seedExtraCurricularPosts({ schoolId: school.id });

      await this.seedFees({ schoolId: school.id });

      await this.seedFeeItems({ schoolId: school.id });

      await this.seedHomework({ schoolId: school.id });

      // tenant.users.forEach(async (userInfo) => {
      //   const { account } = await this.accountSeed.run({
      //     email: userInfo.email,
      //     accountRole: AccountRole.USER,
      //   });

      //   const user = await this.userSeed.run({
      //     accountId: account.id,
      //     schoolId: school.id,
      //   });

      //   await this.actorSeed.run({ role: userInfo.role, userId: user.id });
      // });

      // tenant.parentsWithStudents.forEach(async (parentInfo) => {
      //   const { account } = await this.accountSeed.run({
      //     email: parentInfo.email,
      //     accountRole: AccountRole.USER,
      //   });

      //   const user = await this.userSeed.run({
      //     accountId: account.id,
      //     schoolId: school.id,
      //   });

      //   const response = await this.actorSeed.run({ role: parentInfo.role, userId: user.id });
      //   if (response?.type === UserRole.PARENT && parentInfo.role === UserRole.PARENT) {
      //     const parent = response.data;
      //     parentInfo.students.forEach(async (studentInfo) => {
      //       const student = await this.studentSeed.run({ schoolId: school.id, student: studentInfo });
      //       await this.parentStudentSeed.run({ parentId: parent.id, studentId: student.id });
      //     });
      //   }
      // });
    });
  };
}
