import { prisma } from '@/bootstrap/db.init';
import { RepoError } from '@/err/repo/DbError';
import { TX } from '@/types/prisma/PrismaTransaction';
import { CreateStudentProfileRequest } from '@repo/contracts/schemas/studentProfile/createStudentProfileRequest';
import { UpdateStudentProfileRequest } from '@repo/contracts/schemas/studentProfile/updateStudentProfileRequest';

export class StudentProfileRepo {
  create = async (params: { input: CreateStudentProfileRequest; studentId: string; schoolId: string }, tx?: TX) => {
    const { input, studentId, schoolId } = params;
    const client = tx ?? prisma;
    try {
      const createdStudentProfile = await client.studentProfile.create({
        data: {
          allergies: input.allergies,
          healthInfo: input.healthInfo,
          vaccine: input.vaccine,
          cpr: input.cpr,
          emergencyContactName1: input.emergencyContacts?.[0]?.name ?? null,
          emergencyContactPhone1: input.emergencyContacts?.[0]?.phone ?? null,
          emergencyContactRelation1: input.emergencyContacts?.[0]?.relation ?? null,
          emergencyContactName2: input.emergencyContacts?.[1]?.name ?? null,
          emergencyContactPhone2: input.emergencyContacts?.[1]?.phone ?? null,
          emergencyContactRelation2: input.emergencyContacts?.[1]?.relation ?? null,
          notes: input.notes,
          student: {
            connect: {
              id: studentId,
              schoolId,
            },
          },
        },
      });
      return createdStudentProfile;
    } catch (error) {
      RepoError.throwRepoError(error);
    }
  };

  update = async (params: { input: UpdateStudentProfileRequest; studentId: string; schoolId: string }, tx?: TX) => {
    const { input, studentId, schoolId } = params;
    const client = tx ?? prisma;
    try {
      const updatedStudentProfile = await client.studentProfile.update({
        where: {
          id: studentId,
          student: {
            schoolId,
          },
        },
        data: {
          allergies: input.allergies,
          healthInfo: input.healthInfo,
          vaccine: input.vaccine,
          cpr: input.cpr,
          emergencyContactName1: input.emergencyContacts?.[0]?.name ?? null,
          emergencyContactPhone1: input.emergencyContacts?.[0]?.phone ?? null,
          emergencyContactRelation1: input.emergencyContacts?.[0]?.relation ?? null,
          emergencyContactName2: input.emergencyContacts?.[1]?.name ?? null,
          emergencyContactPhone2: input.emergencyContacts?.[1]?.phone ?? null,
          emergencyContactRelation2: input.emergencyContacts?.[1]?.relation ?? null,
          notes: input.notes,
        },
      });
      return updatedStudentProfile;
    } catch (error) {
      RepoError.throwRepoError(error);
    }
  };

  getByIdAndSchoolId = async (params: { studentId: string; schoolId: string }, tx?: TX) => {
    const { studentId, schoolId } = params;
    const client = tx ?? prisma;
    try {
      const studentProfile = await client.studentProfile.findUnique({
        where: {
          id: studentId,
          student: {
            schoolId,
          },
        },
      });
      return studentProfile;
    } catch (error) {
      RepoError.throwRepoError(error);
    }
  };
}
