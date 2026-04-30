-- CreateEnum
CREATE TYPE "AccountRole" AS ENUM ('USER', 'ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'DISABLED', 'DELETED');

-- CreateEnum
CREATE TYPE "SchoolPlan" AS ENUM ('FREE', 'PRO', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "SchoolStatus" AS ENUM ('ACTIVE', 'PENDING', 'SUSPENDED', 'DELETED');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'DISABLED', 'DELETED');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('DIRECTOR', 'MANAGER', 'TEACHER', 'PARENT', 'NURSE', 'DRIVER');

-- CreateEnum
CREATE TYPE "ClassGrade" AS ENUM ('KG', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX');

-- CreateEnum
CREATE TYPE "MediaStatus" AS ENUM ('PENDING', 'CONFIRMED', 'DELETED', 'FAILED');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO', 'DOCUMENT');

-- CreateEnum
CREATE TYPE "NotificationRecipientType" AS ENUM ('ALL', 'COUNTRY', 'ROLE', 'USER');

-- CreateEnum
CREATE TYPE "NotificationScheduleType" AS ENUM ('SCHEDULED', 'DELAYED');

-- CreateEnum
CREATE TYPE "NotificationLanguage" AS ENUM ('en', 'ar', 'fr');

-- CreateEnum
CREATE TYPE "DeliveryStatus" AS ENUM ('PENDING', 'SENT', 'DELIVERED', 'READ', 'FAILED');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'LATE', 'EXCUSED');

-- CreateEnum
CREATE TYPE "StudentStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'EXPELLED');

-- CreateEnum
CREATE TYPE "Semester" AS ENUM ('FIRST', 'SECOND', 'THIRD');

-- CreateEnum
CREATE TYPE "SubjectDomain" AS ENUM ('ARABIC_LANGUAGE', 'SCIENCE_TECHNOLOGY', 'SOCIAL_EDUCATION', 'ART_EDUCATION', 'PHYSICAL_EDUCATION', 'FRENCH_LANGUAGE', 'ENGLISH_LANGUAGE');

-- CreateTable
CREATE TABLE "accounts" (
    "id" UUID NOT NULL,
    "authId" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255),
    "provider" VARCHAR(255) NOT NULL,
    "username" VARCHAR(255),
    "role" "AccountRole" NOT NULL DEFAULT 'USER',
    "isEmailVerified" BOOLEAN NOT NULL,
    "status" "AccountStatus" NOT NULL DEFAULT 'ACTIVE',
    "avatarId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "school_owner" (
    "id" UUID NOT NULL,
    "firstName" VARCHAR(255) NOT NULL,
    "lastName" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(50) NOT NULL,
    "accountId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "school_owner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schools" (
    "id" UUID NOT NULL,
    "nameEn" VARCHAR(255) NOT NULL,
    "nameFr" VARCHAR(255) NOT NULL,
    "nameAr" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "address" TEXT,
    "phone" VARCHAR(30) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "website" VARCHAR(255),
    "plan" "SchoolPlan" NOT NULL DEFAULT 'FREE',
    "slug" VARCHAR(255) NOT NULL,
    "logoId" UUID,
    "ownerId" UUID NOT NULL,
    "status" "SchoolStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "schools_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'PARENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "firstName" VARCHAR(255) NOT NULL,
    "lastName" VARCHAR(255) NOT NULL,
    "gender" "Gender" NOT NULL,
    "dateOfBirth" DATE,
    "phone" VARCHAR(30),
    "address" VARCHAR(255),
    "cin" VARCHAR(50),
    "schoolId" UUID NOT NULL,
    "accountId" UUID NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "classrooms" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "grade" "ClassGrade" NOT NULL,
    "schoolId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "classrooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feeItems" (
    "id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "feeId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feeItems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fees" (
    "id" UUID NOT NULL,
    "schoolId" UUID NOT NULL,
    "studentId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Media" (
    "id" UUID NOT NULL,
    "key" VARCHAR(255) NOT NULL,
    "baseName" VARCHAR(255) NOT NULL,
    "type" "MediaType" NOT NULL,
    "mimeType" VARCHAR(255) NOT NULL,
    "fileSize" INTEGER,
    "status" "MediaStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "confirmedAt" TIMESTAMP(3),

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" UUID NOT NULL,
    "description" TEXT,
    "recipientType" "NotificationRecipientType" NOT NULL,
    "scheduleType" "NotificationScheduleType" NOT NULL,
    "delaySeconds" INTEGER,
    "scheduledAt" TIMESTAMP(3),
    "createdById" UUID NOT NULL,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationTranslation" (
    "id" UUID NOT NULL,
    "language" "NotificationLanguage" NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "data" JSONB,
    "notificationId" UUID NOT NULL,

    CONSTRAINT "NotificationTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationTargeting" (
    "id" UUID NOT NULL,
    "notificationId" UUID NOT NULL,
    "countries" TEXT[],
    "roles" "AccountRole"[],

    CONSTRAINT "NotificationTargeting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationTargetUser" (
    "id" UUID NOT NULL,
    "targetingId" UUID NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "NotificationTargetUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationDelivery" (
    "id" UUID NOT NULL,
    "notificationId" UUID NOT NULL,
    "status" "DeliveryStatus" NOT NULL DEFAULT 'PENDING',
    "sentAt" TIMESTAMP(3),
    "readAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NotificationDelivery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_profiles" (
    "id" UUID NOT NULL,
    "healthInfo" TEXT,
    "vaccine" TEXT,
    "cpr" TEXT,
    "allergies" TEXT,
    "notes" TEXT,
    "emergencyContactName1" TEXT,
    "emergencyContactPhone1" TEXT,
    "emergencyContactRelation1" TEXT,
    "emergencyContactName2" TEXT,
    "emergencyContactPhone2" TEXT,
    "emergencyContactRelation2" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "students" (
    "id" UUID NOT NULL,
    "uid" VARCHAR(50),
    "firstName_ar" VARCHAR(255),
    "lastName_ar" VARCHAR(255),
    "firstName_en" VARCHAR(255),
    "lastName_en" VARCHAR(255),
    "dateOfBirth" DATE,
    "gender" "Gender" NOT NULL,
    "status" "StudentStatus" NOT NULL,
    "schoolId" UUID NOT NULL,
    "classId" UUID,
    "avatarId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parents" (
    "id" UUID NOT NULL,
    "emergencyPhone" VARCHAR(20),
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_parents" (
    "id" UUID NOT NULL,
    "parentId" UUID NOT NULL,
    "studentId" UUID NOT NULL,

    CONSTRAINT "student_parents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teachers" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teachers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subjects" (
    "id" UUID NOT NULL,
    "name_en" VARCHAR(255) NOT NULL,
    "name_fr" VARCHAR(255) NOT NULL,
    "name_ar" VARCHAR(255) NOT NULL,
    "hoursPerWeek" SMALLINT NOT NULL,
    "domain" "SubjectDomain" NOT NULL,
    "grade" "ClassGrade" NOT NULL,
    "schoolId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assignments" (
    "id" UUID NOT NULL,
    "subjectId" UUID NOT NULL,
    "classroomId" UUID NOT NULL,
    "teacherId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "schoolId" UUID NOT NULL,

    CONSTRAINT "assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "timetable" (
    "id" UUID NOT NULL,
    "assignmentId" UUID NOT NULL,
    "day" "DayOfWeek" NOT NULL,
    "startTime" TIME NOT NULL,
    "endTime" TIME NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "schoolId" UUID NOT NULL,

    CONSTRAINT "timetable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exams" (
    "id" UUID NOT NULL,
    "name_en" VARCHAR(255) NOT NULL,
    "name_fr" VARCHAR(255) NOT NULL,
    "name_ar" VARCHAR(255) NOT NULL,
    "durationInMin" SMALLINT NOT NULL,
    "subjectId" UUID NOT NULL,
    "schoolId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exams_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "accounts_status_idx" ON "accounts"("status");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_email_key" ON "accounts"("email");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_authId_key" ON "accounts"("authId");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_avatarId_key" ON "accounts"("avatarId");

-- CreateIndex
CREATE UNIQUE INDEX "school_owner_accountId_key" ON "school_owner"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "schools_ownerId_key" ON "schools"("ownerId");

-- CreateIndex
CREATE INDEX "schools_plan_idx" ON "schools"("plan");

-- CreateIndex
CREATE UNIQUE INDEX "schools_slug_key" ON "schools"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "schools_logoId_key" ON "schools"("logoId");

-- CreateIndex
CREATE UNIQUE INDEX "user_roles_userId_role_key" ON "user_roles"("userId", "role");

-- CreateIndex
CREATE UNIQUE INDEX "users_accountId_schoolId_key" ON "users"("accountId", "schoolId");

-- CreateIndex
CREATE UNIQUE INDEX "classrooms_schoolId_name_grade_key" ON "classrooms"("schoolId", "name", "grade");

-- CreateIndex
CREATE UNIQUE INDEX "fees_schoolId_studentId_key" ON "fees"("schoolId", "studentId");

-- CreateIndex
CREATE UNIQUE INDEX "Media_key_key" ON "Media"("key");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationTranslation_notificationId_language_key" ON "NotificationTranslation"("notificationId", "language");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationTargeting_notificationId_key" ON "NotificationTargeting"("notificationId");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationTargetUser_targetingId_userId_key" ON "NotificationTargetUser"("targetingId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "students_avatarId_key" ON "students"("avatarId");

-- CreateIndex
CREATE UNIQUE INDEX "students_schoolId_uid_key" ON "students"("schoolId", "uid");

-- CreateIndex
CREATE UNIQUE INDEX "parents_userId_key" ON "parents"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "student_parents_parentId_studentId_key" ON "student_parents"("parentId", "studentId");

-- CreateIndex
CREATE UNIQUE INDEX "teachers_userId_key" ON "teachers"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "subjects_schoolId_grade_name_en_key" ON "subjects"("schoolId", "grade", "name_en");

-- CreateIndex
CREATE UNIQUE INDEX "subjects_schoolId_grade_name_fr_key" ON "subjects"("schoolId", "grade", "name_fr");

-- CreateIndex
CREATE UNIQUE INDEX "subjects_schoolId_grade_name_ar_key" ON "subjects"("schoolId", "grade", "name_ar");

-- CreateIndex
CREATE UNIQUE INDEX "assignments_schoolId_classroomId_subjectId_key" ON "assignments"("schoolId", "classroomId", "subjectId");

-- CreateIndex
CREATE INDEX "timetable_schoolId_assignmentId_idx" ON "timetable"("schoolId", "assignmentId");

-- CreateIndex
CREATE UNIQUE INDEX "exams_schoolId_subjectId_name_en_key" ON "exams"("schoolId", "subjectId", "name_en");

-- CreateIndex
CREATE UNIQUE INDEX "exams_schoolId_subjectId_name_fr_key" ON "exams"("schoolId", "subjectId", "name_fr");

-- CreateIndex
CREATE UNIQUE INDEX "exams_schoolId_subjectId_name_ar_key" ON "exams"("schoolId", "subjectId", "name_ar");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_avatarId_fkey" FOREIGN KEY ("avatarId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "school_owner" ADD CONSTRAINT "school_owner_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schools" ADD CONSTRAINT "schools_logoId_fkey" FOREIGN KEY ("logoId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schools" ADD CONSTRAINT "schools_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "school_owner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classrooms" ADD CONSTRAINT "classrooms_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feeItems" ADD CONSTRAINT "feeItems_feeId_fkey" FOREIGN KEY ("feeId") REFERENCES "fees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fees" ADD CONSTRAINT "fees_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fees" ADD CONSTRAINT "fees_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationTranslation" ADD CONSTRAINT "NotificationTranslation_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "Notification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationTargeting" ADD CONSTRAINT "NotificationTargeting_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "Notification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationTargetUser" ADD CONSTRAINT "NotificationTargetUser_targetingId_fkey" FOREIGN KEY ("targetingId") REFERENCES "NotificationTargeting"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationTargetUser" ADD CONSTRAINT "NotificationTargetUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationDelivery" ADD CONSTRAINT "NotificationDelivery_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "Notification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_profiles" ADD CONSTRAINT "student_profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classrooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_avatarId_fkey" FOREIGN KEY ("avatarId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parents" ADD CONSTRAINT "parents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_parents" ADD CONSTRAINT "student_parents_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "parents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_parents" ADD CONSTRAINT "student_parents_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "classrooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "teachers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timetable" ADD CONSTRAINT "timetable_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "assignments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timetable" ADD CONSTRAINT "timetable_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exams" ADD CONSTRAINT "exams_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exams" ADD CONSTRAINT "exams_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;
