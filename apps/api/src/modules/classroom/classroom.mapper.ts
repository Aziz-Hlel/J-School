import { globalMediaService } from '@/media/media.service';
import { ClassroomResponse } from '@repo/contracts/schemas/classroom/classResponse';
import { ClassWithStudentsSelectRes } from '@repo/contracts/schemas/classroom/classWithStudentsSelectRes';
import { Classroom, Prisma } from '@repo/db/prisma/client';

export class ClassroomMapper {
  static toResponse = (classroom: Classroom): ClassroomResponse => {
    return {
      id: classroom.id,
      name: classroom.name,
      description: classroom.description,
      grade: classroom.grade,
      createdAt: classroom.createdAt.toISOString(),
      updatedAt: classroom.updatedAt.toISOString(),
    };
  };

  static toClassWithStudentsSelectRes = (
    classroom: Prisma.ClassroomGetPayload<{
      include: {
        students: {
          include: {
            avatar: true;
          };
        };
      };
    }>,
  ): ClassWithStudentsSelectRes => {
    return {
      id: classroom.id,
      name: classroom.name,
      grade: classroom.grade,
      students: classroom.students.map((student) => ({
        id: student.id,
        firstName: {
          en: student.firstName_en,
          ar: student.firstName_ar,
        },
        lastName: {
          en: student.lastName_en,
          ar: student.lastName_ar,
        },
        avatar: globalMediaService.toMediaRes(student.avatar),
      })),
    };
  };
}
