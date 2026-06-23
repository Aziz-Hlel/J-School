import { createMediaModule as mediaModule } from '@/media';
import { AftercareModule } from '@/modules/Aftercare/aftercare.module';
import { AttendanceModule } from '@/modules/Attendance/attendance.module';
import { CalendarModule } from '@/modules/Calendar/calendar.module';
import { ExamScheduleModule } from '@/modules/ExamSchedule/ExamSchedule.module';
import { ExtraCurricularModule } from '@/modules/ExtraCurricular/ExtraCurricular.module';
import { ExtraCurricularPostsModule } from '@/modules/ExtraCurricular/posts/ExtraCurricularPosts.module';
import { FeeItemsModule } from '@/modules/FeeItems/feeItems.module';
import { FeesModule } from '@/modules/Fees/fees.module';
import { HomeworkModule } from '@/modules/Homework/homework.module';
import { MobileModule } from '@/modules/Mobile/mobile.module';
import { NotificationModule } from '@/modules/Notification/notification.module';
import { parentStudentModule } from '@/modules/ParentStudent/parentStudent.module';
import { TeacherCommentsModule } from '@/modules/TeacherComments/teacherComments.module';
import { createUserModule as userModule } from '@/modules/User';
import { AccountModule } from '@/modules/accounts/account.module';
import { AssignmentModule } from '@/modules/assignment/assignment.module';
import { authModule } from '@/modules/auth/auth.module';
import { ClassroomManagementModule } from '@/modules/classroom/ClassroomManagement/ClassroomManagement.module';
import { ClassroomModule } from '@/modules/classroom/classroom.module';
import { ClassroomTimetableModule } from '@/modules/classroom/timetable/ClassroomTimetable.module';
import { FeedModule } from '@/modules/feed/feed.module';
import { createOwnerModule as ownerModule } from '@/modules/owner/owner.module';
import { ParentModule } from '@/modules/parent/parent.module';
import { createRootModule as rootModule } from '@/modules/root/root.module';
import { createSchoolModule as schoolModule } from '@/modules/schools/school.module';
import { StaffModule } from '@/modules/staff/staff.module';
import { StudentModule } from '@/modules/student/student.module';
import { StudentProfileModule } from '@/modules/studentProfile/studentProfile.module';
import { SubjectModule } from '@/modules/subject/subject.module';
import { TeacherModule } from '@/modules/teacher/teacher.module';
import { TimeTableModule } from '@/modules/timetable/timetable.module';
import { createUserRoleModule } from '@/modules/userRoles/userRole.module';
import { SeedDevService } from '@/seeds/dev/seedDev.service';
import { AccountSeed } from '@/seeds/fakes/account.seed';
import { ActorSeed } from '@/seeds/fakes/actor.seed';
import { AnnouncementSeed } from '@/seeds/fakes/announcement.seed';
import { AssignmentSeed } from '@/seeds/fakes/assignment.seed';
import { ClassroomSeed2 } from '@/seeds/fakes/classroom.seed2';
import { ExtracurricularSeed } from '@/seeds/fakes/extraCurricular.seed';
import { ExtraCurricularSessionsSeed } from '@/seeds/fakes/extraCurricularSessions.seed';
import { FeeSeed } from '@/seeds/fakes/fee.seed';
import { FeeItemSeed } from '@/seeds/fakes/feeItem.seed';
import { HomeworkSeed } from '@/seeds/fakes/homework.seed';
import { MediaSeed } from '@/seeds/fakes/media.seed';
import { MediaSeedV2 } from '@/seeds/fakes/media.seed2';
import { OwnerSeed } from '@/seeds/fakes/owner.seed';
import { ParentSeed } from '@/seeds/fakes/parent.seed';
import { ParentStudentSeed } from '@/seeds/fakes/parentStudent.seed';
import { PostSeed } from '@/seeds/fakes/post.seed';
import { ReactionSeed } from '@/seeds/fakes/reaction.seed';
import { SchoolSeed } from '@/seeds/fakes/school.seed';
import { StudentSeed } from '@/seeds/fakes/student.seed';
import { SubjectAndExamsSeed2 } from '@/seeds/fakes/subject.seed2';
import { TeacherSeed } from '@/seeds/fakes/teacher.seed';
import { TimetableSeed } from '@/seeds/fakes/timtable.seed';
import { UserRolesSeed } from '@/seeds/fakes/userRoles.seed';
import { UserSeed } from '@/seeds/fakes/users.fake';
import { Router } from 'express';

// * ROOT
const { rootRouter } = rootModule();

// * MOBILE
const { mobileRouter } = MobileModule();

// * MEDIA
const { mediaRouter } = mediaModule();

// * ACCOUNT
const { accountRouter, accountService } = AccountModule();

// * OWNER
const { ownerRouter, ownerService } = ownerModule();

// * SCHOOL
const { schoolRouter } = schoolModule({ ownerService });

// * USER
const { userRouter, userRepo, createSimpleUserUseCase, userService } = userModule({ accountService });

// * USER ROLE
const { userRoleRouter, userRoleService } = createUserRoleModule();

// * STAFF
const { staffRouter } = StaffModule({ createSimpleUserUseCase, userService });

// * TEACHER
const { teacherRouter } = TeacherModule({ createSimpleUserUseCase, userService });

// * PARENT STUDENT
const { parentStudentRouter, parentStudentService } = parentStudentModule();

// * PARENT
const { parentService, parentRepo, parentRouter } = ParentModule({ accountService, userRoleService, userService });

// * STUDENT
const { studentRouter } = StudentModule({
  userRepo,
  parentStudentService,
  userRoleService,
  createSimpleUserUseCase,
  parentService,
  parentRepo,
});

// * STUDENT PROFILE
const { studentProfileRouter } = StudentProfileModule();

// * SUBJECT
const { subjectRouter, subjectInternal } = SubjectModule();

// * ASSIGNMENT
const { assignmentInternal, assignmentRouter } = AssignmentModule();

// * CLASSROOM
const { classroomRouter, createClassroomUseCase } = ClassroomModule({ assignmentInternal, subjectInternal });

// * CLASSROOM TIMETABLE
const { classroomTimetableRouter } = ClassroomTimetableModule();

// * TimeTable
const { timetableRouter } = TimeTableModule();

// * CLASSROOM MANAGEMENT
const { classroomManagementRouter } = ClassroomManagementModule();

// * EXAM SCHEDULE
const { examScheduleRouter } = ExamScheduleModule();

// * EXTRA CURRICULAR
const { extraCurricularRouter } = ExtraCurricularModule();

// * EXTRA CURRICULAR POSTS
const { extraCurricularPostsRouter } = ExtraCurricularPostsModule();

// * ATTENDANCE
const { attendanceRouter } = AttendanceModule();

// * ANNOUNCEMENT
const { announcementRouter } = FeedModule();

// * FEES
const { feesRouter } = FeesModule();

// * FEE ITEMS
const { feeItemsRouter } = FeeItemsModule();

// * TEACHER COMMENTS
const { teacherCommentsRouter } = TeacherCommentsModule();

// * HOMEWORK
const { homeworkRouter } = HomeworkModule();

// * AFTERCARE
const { aftercareRouter } = AftercareModule();

// * Calendar
const { calendarRouter } = CalendarModule();

// *
// * AUTH
const { authRouter } = authModule(accountService);

// * NOTIFICATION
const { notificationRouter } = NotificationModule();
// const { notificationRouter } = notificationModule({ userRepo });

const mediaSeed = new MediaSeed();
const accountSeed = new AccountSeed(accountService);
const ownerSeed = new OwnerSeed(ownerService);
const schoolSeed = new SchoolSeed();
const userSeed = new UserSeed();
const userRolesSeed = new UserRolesSeed(userRoleService);
const teacherSeed = new TeacherSeed();
const parentSeed = new ParentSeed();
const actorSeed = new ActorSeed(userRolesSeed, teacherSeed, parentSeed);
const studentSeed = new StudentSeed(mediaSeed);
const parentStudentSeed = new ParentStudentSeed();
// const classroomSeed = new ClassroomSeed();
// const subjectSeed = new SubjectSeed();
const classroomSeed2 = new ClassroomSeed2(createClassroomUseCase);
const subjectSeed2 = new SubjectAndExamsSeed2();
const assignmentSeed = new AssignmentSeed();
const timetableSeed = new TimetableSeed();
const announcementSeed = new AnnouncementSeed();
const reactionSeed = new ReactionSeed();
const extraCurricularSeed = new ExtracurricularSeed();
const extraCurricularSessionsSeed = new ExtraCurricularSessionsSeed();
const postSeed = new PostSeed();
const feeSeed = new FeeSeed();
const feeItemSeed = new FeeItemSeed();
const homeworkSeed = new HomeworkSeed();

const mediaSeed2 = new MediaSeedV2();

const seedDevService = new SeedDevService(
  accountSeed,
  ownerSeed,
  schoolSeed,
  userSeed,
  actorSeed,
  teacherSeed,
  parentSeed,
  studentSeed,
  parentStudentSeed,
  classroomSeed2,
  subjectSeed2,
  assignmentSeed,
  timetableSeed,
  mediaSeed2,
  announcementSeed,
  reactionSeed,
  extraCurricularSeed,
  extraCurricularSessionsSeed,
  postSeed,
  feeSeed,
  feeItemSeed,
  homeworkSeed,
);

seedDevService.run();

export const container: { router: Router; resource: string }[] = [
  { router: rootRouter, resource: '' },
  { router: mediaRouter, resource: 'media' },
  { router: mobileRouter, resource: 'mobile' },

  { router: accountRouter, resource: 'accounts' },
  { router: authRouter, resource: 'auth' },
  { router: ownerRouter, resource: 'owners' },
  { router: schoolRouter, resource: 'schools' },
  { router: staffRouter, resource: 'schools/:schoolId/staff' },
  { router: teacherRouter, resource: 'schools/:schoolId/teachers' },
  { router: studentRouter, resource: 'schools/:schoolId/students' },
  { router: parentRouter, resource: 'schools/:schoolId/parents' },
  { router: studentProfileRouter, resource: 'schools/:schoolId/students/:studentId/profiles' },
  { router: parentStudentRouter, resource: 'schools/:schoolId/students/:studentId/parents/:parentId' },
  { router: subjectRouter, resource: 'schools/:schoolId/subjects' },
  { router: assignmentRouter, resource: 'schools/:schoolId/classrooms/:classroomId/assignments' },
  { router: classroomRouter, resource: 'schools/:schoolId/classrooms' },
  { router: classroomManagementRouter, resource: 'schools/:schoolId/classrooms/:classroomId' },
  { router: classroomTimetableRouter, resource: 'schools/:schoolId/classrooms/:classroomId/timetable' },
  { router: timetableRouter, resource: 'schools/:schoolId/assignments/:assignmentId/timetable' },
  { router: examScheduleRouter, resource: 'schools/:schoolId/exam-schedules' },
  { router: extraCurricularRouter, resource: 'schools/:schoolId/extra-curriculars' },
  { router: extraCurricularPostsRouter, resource: 'schools/:schoolId/extra-curriculars/:extraCurricularId/posts' },
  { router: attendanceRouter, resource: 'schools/:schoolId/attendances' },
  { router: announcementRouter, resource: 'schools/:schoolId/feed' },
  { router: feesRouter, resource: 'schools/:schoolId/fees' },
  { router: feeItemsRouter, resource: 'schools/:schoolId/fees/:feeId/items' },
  { router: homeworkRouter, resource: 'schools/:schoolId/homework' },
  { router: teacherCommentsRouter, resource: 'schools/:schoolId/teachers/:teacherId/comments' },
  { router: aftercareRouter, resource: 'schools/:schoolId/aftercares' },
  { router: calendarRouter, resource: 'schools/:schoolId/calendars' },

  { router: userRouter, resource: 'schools/:schoolId/users' },
  { router: notificationRouter, resource: 'schools/:schoolId/notifications' },
  { router: userRoleRouter, resource: 'schools/:schoolId/users/:userId/roles' },
  // { router: notificationRouter, resource: 'notifications' },
];
