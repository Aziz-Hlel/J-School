import { Classroom } from '@repo/db/prisma/client';
import { ClassroomResponse } from '@repo/contracts/schemas/classroom/classResponse';

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
}
