import { prisma } from '@/bootstrap/db.init';
import { RepoError } from '@/err/repo/DbError';
import { StudentStatus } from '@repo/db/prisma/enums';
import { TX } from '@/types/prisma/PrismaTransaction';
import { toDate } from '@/utils/toDate';
import { CreateStudentRequest } from '@repo/contracts/schemas/student/createStudentRequest';
import { CreateStudentWithProfileRequest } from '@repo/contracts/schemas/student/createStudentWithProfile';
import { UpdateStudentRequest } from '@repo/contracts/schemas/student/updateStudentRequest';
import { UpdateStudentWithProfileRequest } from '@repo/contracts/schemas/student/updateStudentWithProfileRequest';

export class StudentRepo {
  create = async (params: { input: CreateStudentRequest & { status: StudentStatus }; schoolId: string }, tx?: TX) => {
    try {
      const { input, schoolId } = params;
      const client = tx ?? prisma;
      const createdStudent = await client.student.create({
        data: {
          uid: input.uid,
          firstName_en: input.firstName.en,
          lastName_en: input.lastName.en,
          firstName_ar: input.firstName.ar,
          lastName_ar: input.lastName.ar,
          gender: input.gender,
          dateOfBirth: toDate(input.dateOfBirth),
          avatarId: input.avatarId,
          status: input.status,
          schoolId,
        },
        include: { avatar: true, profile: true },
      });
      return createdStudent;
    } catch (error) {
      RepoError.throwRepoError(error);
    }
  };

  update = async (
    params: { input: UpdateStudentRequest & { status: StudentStatus }; studentId: string; schoolId: string },
    tx?: TX,
  ) => {
    try {
      const { input, studentId, schoolId } = params;
      const client = tx ?? prisma;
      const updatedStudent = await client.student.update({
        where: { id: studentId, schoolId },
        data: {
          uid: input.uid,
          firstName_en: input.firstName.en,
          lastName_en: input.lastName.en,
          firstName_ar: input.firstName.ar,
          lastName_ar: input.lastName.ar,
          gender: input.gender,
          dateOfBirth: toDate(input.dateOfBirth),
          avatarId: input.avatarId,
          status: input.status,
          schoolId,
        },
        include: { avatar: true, profile: true },
      });
      return updatedStudent;
    } catch (error) {
      RepoError.throwRepoError(error);
    }
  };

  createWithProfile = async (
    params: { input: CreateStudentWithProfileRequest & { status: StudentStatus }; schoolId: string },
    tx?: TX,
  ) => {
    try {
      const { input, schoolId } = params;
      const client = tx ?? prisma;
      const createdStudent = await client.student.create({
        data: {
          uid: input.uid,
          firstName_en: input.firstName.en,
          lastName_en: input.lastName.en,
          firstName_ar: input.firstName.ar,
          lastName_ar: input.lastName.ar,
          gender: input.gender,
          dateOfBirth: toDate(input.dateOfBirth),
          avatarId: input.avatarId,
          status: input.status,
          schoolId,
          ...(input.profile
            ? {
                profile: {
                  create: {
                    allergies: input.profile.allergies,
                    healthInfo: input.profile.healthInfo,
                    vaccine: input.profile.vaccine,
                    cpr: input.profile.cpr,
                    emergencyContactName1: input.profile.emergencyContacts?.[0]?.name ?? null,
                    emergencyContactPhone1: input.profile.emergencyContacts?.[0]?.phone ?? null,
                    emergencyContactRelation1: input.profile.emergencyContacts?.[0]?.relation ?? null,
                    emergencyContactName2: input.profile.emergencyContacts?.[1]?.name ?? null,
                    emergencyContactPhone2: input.profile.emergencyContacts?.[1]?.phone ?? null,
                    emergencyContactRelation2: input.profile.emergencyContacts?.[1]?.relation ?? null,
                    notes: input.profile.notes,
                  },
                },
              }
            : undefined),
        },
        include: { avatar: true, profile: true },
      });
      return createdStudent;
    } catch (error) {
      RepoError.throwRepoError(error);
    }
  };

  updateWithProfile = async (
    params: { input: UpdateStudentWithProfileRequest & { status: StudentStatus }; studentId: string; schoolId: string },
    tx?: TX,
  ) => {
    try {
      const { input, studentId, schoolId } = params;
      const client = tx ?? prisma;
      const updatedStudent = await client.student.update({
        where: { id: studentId, schoolId },
        data: {
          uid: input.uid,
          firstName_en: input.firstName.en,
          lastName_en: input.lastName.en,
          firstName_ar: input.firstName.ar,
          lastName_ar: input.lastName.ar,
          gender: input.gender,
          dateOfBirth: toDate(input.dateOfBirth),
          avatarId: input.avatarId,
          status: input.status,
          schoolId,
          ...(input.profile
            ? {
                profile: {
                  upsert: {
                    where: {
                      id: studentId,
                    },
                    create: {
                      allergies: input.profile.allergies,
                      healthInfo: input.profile.healthInfo,
                      vaccine: input.profile.vaccine,
                      cpr: input.profile.cpr,
                      emergencyContactName1: input.profile.emergencyContacts?.[0]?.name,
                      emergencyContactPhone1: input.profile.emergencyContacts?.[0]?.phone,
                      emergencyContactRelation1: input.profile.emergencyContacts?.[0]?.relation,
                      emergencyContactName2: input.profile.emergencyContacts?.[1]?.name,
                      emergencyContactPhone2: input.profile.emergencyContacts?.[1]?.phone,
                      emergencyContactRelation2: input.profile.emergencyContacts?.[1]?.relation,
                      notes: input.profile.notes,
                    },
                    update: {
                      allergies: input.profile.allergies,
                      healthInfo: input.profile.healthInfo,
                      vaccine: input.profile.vaccine,
                      cpr: input.profile.cpr,
                      emergencyContactName1: input.profile.emergencyContacts?.[0]?.name ?? null,
                      emergencyContactPhone1: input.profile.emergencyContacts?.[0]?.phone ?? null,
                      emergencyContactRelation1: input.profile.emergencyContacts?.[0]?.relation ?? null,
                      emergencyContactName2: input.profile.emergencyContacts?.[1]?.name ?? null,
                      emergencyContactPhone2: input.profile.emergencyContacts?.[1]?.phone ?? null,
                      emergencyContactRelation2: input.profile.emergencyContacts?.[1]?.relation ?? null,
                      notes: input.profile.notes,
                    },
                  },
                },
              }
            : undefined),
        },
        include: { avatar: true, profile: true },
      });
      return updatedStudent;
    } catch (error) {
      RepoError.throwRepoError(error);
    }
  };

  findById = async (params: { schoolId: string; studentId: string }, tx?: TX) => {
    try {
      const { schoolId, studentId } = params;
      const client = tx ?? prisma;
      const student = await client.student.findUnique({
        where: { id: studentId, schoolId },
        include: { avatar: true, profile: true },
      });
      return student;
    } catch (error) {
      RepoError.throwRepoError(error);
    }
  };
}
