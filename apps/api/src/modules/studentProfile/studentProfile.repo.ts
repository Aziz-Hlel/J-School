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
          notes: input.notes,
          student: {
            connect: {
              id: studentId,
              schoolId,
            },
          },
          emergencyContacts: {
            createMany: { data: input.emergencyContacts },
          },
        },
        include: {
          emergencyContacts: true,
        },
      });
      return createdStudentProfile;
    } catch (error) {
      RepoError.throwRepoError(error);
    }
  };

  update = async (params: { input: UpdateStudentProfileRequest; studentId: string; schoolId: string }) => {
    const { input, studentId, schoolId } = params;
    try {
      return await prisma.$transaction(async (tx) => {
        await tx.emergencyContact.deleteMany({
          where: {
            profileId: studentId,
          },
        });
        const updatedStudentProfile = await tx.studentProfile.update({
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
            notes: input.notes,
          },
          include: {
            emergencyContacts: true,
          },
        });
        return updatedStudentProfile;
      });
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
        include: {
          emergencyContacts: true,
        },
      });
      return studentProfile;
    } catch (error) {
      RepoError.throwRepoError(error);
    }
  };
}
