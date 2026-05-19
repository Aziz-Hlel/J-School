import { ClassGrade, Gender, StudentStatus } from '@repo/db/prisma/enums';
import { faker } from '@faker-js/faker';
import { MediaSeed } from './media.seed';
import { StudentCreateInput, StudentUncheckedCreateInput } from '@repo/db/prisma/models';
import { TX } from '@/types/prisma/PrismaTransaction';
import { prisma } from '@/bootstrap/db.init';

export class StudentSeed {
  constructor(private readonly mediaSeed: MediaSeed) {}

  generateFakeStudent = async (student: Partial<StudentCreateInput> = {}, schoolId: string, avatarId?: string) => {
    return {
      id: student.id,
      uid: student.uid ?? faker.string.uuid(),
      firstName_ar: student.firstName_ar ?? faker.person.firstName(),
      lastName_ar: student.lastName_ar ?? faker.person.lastName(),
      firstName_en: student.firstName_en ?? faker.person.firstName(),
      lastName_en: student.lastName_en ?? faker.person.lastName(),
      dateOfBirth: student.dateOfBirth ?? faker.date.past(),
      avatarId: avatarId,
      schoolId: schoolId,
      gender: student.gender ?? faker.helpers.arrayElement(Object.values(Gender)),
      status: student.status ?? faker.helpers.arrayElement(Object.values(StudentStatus)),
    } satisfies StudentUncheckedCreateInput;
  };

  run = async (params: { student?: Partial<StudentCreateInput>; schoolId: string }, tx?: TX) => {
    const { student, schoolId } = params;
    const client = tx ?? prisma;
    const fakeAvatar = await this.mediaSeed.run({}, tx);
    const studentPayload = await this.generateFakeStudent(student, schoolId, fakeAvatar.id);
    const createdStudent = await client.student.upsert({
      where: {
        schoolId_uid: {
          schoolId: schoolId,
          uid: studentPayload.uid,
        },
      },
      create: studentPayload,
      update: {},
    });
    return createdStudent;
  };

  runV2 = async (params: { student: Partial<StudentCreateInput> & { id: string }; schoolId: string }, tx?: TX) => {
    const { student, schoolId } = params;
    const client = tx ?? prisma;
    const fakeAvatar = await this.mediaSeed.run({}, tx);
    const studentPayload = await this.generateFakeStudent(student, schoolId, fakeAvatar.id);
    const createdStudent = await client.student.upsert({
      where: { id: student.id },
      create: studentPayload,
      update: {},
    });
    return createdStudent;
  };

  assignStudentToClassroom = async (
    params: { schoolId: string; studentUids: string[]; classroom: { name: string; grade: ClassGrade } },
    tx?: TX,
  ) => {
    const client = tx ?? prisma;
    const { schoolId, studentUids, classroom } = params;
    const clasroom = await client.classroom.findUnique({
      where: {
        schoolId_name_grade: {
          schoolId,
          name: classroom.name,
          grade: classroom.grade,
        },
      },
      select: {
        id: true,
      },
    });
    if (!clasroom) throw new Error('Sedd Error: classroom not found');

    await client.student.updateMany({
      where: {
        uid: {
          in: studentUids,
        },
        schoolId,
      },
      data: {
        classroomId: clasroom.id,
      },
    });
  };
}
