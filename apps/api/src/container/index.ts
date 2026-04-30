import { createMediaModule as mediaModule } from '@/media';
import { parentStudentModule } from '@/modules/ParentStudent/parentStudent.module';
import { createUserModule as userModule } from '@/modules/User';
import { AccountModule } from '@/modules/accounts/account.module';
import { AssignmentModule } from '@/modules/assignment/assignment.module';
import { authModule } from '@/modules/auth/auth.module';
import { ClassroomModule } from '@/modules/classroom/classroom.module';
import { createOwnerModule as ownerModule } from '@/modules/owner/owner.module';
import { ParentModule } from '@/modules/parent/parent.module';
import { createRootModule as rootModule } from '@/modules/root/root.module';
import { createSchoolModule as schoolModule } from '@/modules/schools/school.module';
import { StaffModule } from '@/modules/staff/staff.module';
import { StudentModule } from '@/modules/student/student.module';
import { StudentProfileModule } from '@/modules/studentProfile/studentProfile.module';
import { SubjectModule } from '@/modules/subject/subject.module';
import { TeacherModule } from '@/modules/teacher/teacher.module';
import { createUserRoleModule } from '@/modules/userRoles/userRole.module';
// import { createNotificationModule as notificationModule } from '@/notification';
import { SeedDevService } from '@/seeds/dev/seedDev.service';
import { AccountSeed } from '@/seeds/fakes/account.seed';
import { ActorSeed } from '@/seeds/fakes/actor.seed';
import { ClassroomSeed } from '@/seeds/fakes/classroom.seed';
import { MediaSeed } from '@/seeds/fakes/media.seed';
import { OwnerSeed } from '@/seeds/fakes/owner.seed';
import { ParentSeed } from '@/seeds/fakes/parent.seed';
import { ParentStudentSeed } from '@/seeds/fakes/parentStudent.seed';
import { SchoolSeed } from '@/seeds/fakes/school.seed';
import { StudentSeed } from '@/seeds/fakes/student.seed';
import { SubjectSeed } from '@/seeds/fakes/subject.seed';
import { TeacherSeed } from '@/seeds/fakes/teacher.seed';
import { UserRolesSeed } from '@/seeds/fakes/userRoles.seed';
import { UserSeed } from '@/seeds/fakes/users.fake';
import { Router } from 'express';

// * ROOT
const { rootRouter } = rootModule();

// * MEDIA
const { mediaRouter } = mediaModule();

// * ACCOUNT
const { accountRouter, accountService } = AccountModule();

// * OWNER
const { ownerRouter, ownerService } = ownerModule();

// * SCHOOL
const { schoolRouter, schoolService } = schoolModule({ ownerService });

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
const { parentService, parentRepo } = ParentModule();

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
const { classroomRouter } = ClassroomModule({ assignmentInternal, subjectInternal });

// *
// * AUTH
const { authRouter } = authModule(accountService);

// * NOTIFICATION
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
const classroomSeed = new ClassroomSeed();
const subjectSeed = new SubjectSeed();
const seedDevService = new SeedDevService(
  accountSeed,
  ownerSeed,
  schoolSeed,
  userSeed,
  actorSeed,
  studentSeed,
  parentStudentSeed,
  classroomSeed,
  subjectSeed,
);
seedDevService.run();

export const container: { router: Router; resource: string }[] = [
  { router: rootRouter, resource: 'root' },
  { router: mediaRouter, resource: 'media' },

  { router: accountRouter, resource: 'accounts' },
  { router: authRouter, resource: 'auth' },
  { router: ownerRouter, resource: 'owners' },
  { router: schoolRouter, resource: 'schools' },
  { router: staffRouter, resource: 'schools/:schoolId/staffs' },
  { router: teacherRouter, resource: 'schools/:schoolId/teachers' },
  { router: studentRouter, resource: 'schools/:schoolId/students' },
  { router: studentProfileRouter, resource: 'schools/:schoolId/students/:studentId/profiles' },
  { router: parentStudentRouter, resource: 'schools/:schoolId/students/:studentId/parents/:parentId' },
  { router: subjectRouter, resource: 'schools/:schoolId/subjects' },
  { router: assignmentRouter, resource: 'schools/:schoolId/classrooms/:classroomId/assignments' },
  { router: classroomRouter, resource: 'schools/:schoolId/classrooms' },

  { router: userRouter, resource: 'schools/:schoolId/users' },
  { router: userRoleRouter, resource: 'schools/:schoolId/users/:userId/roles' },
  // { router: notificationRouter, resource: 'notifications' },
];
