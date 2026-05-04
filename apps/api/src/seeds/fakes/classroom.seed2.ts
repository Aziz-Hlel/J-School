import { prisma } from '@/bootstrap/db.init';
import { CreateClassroomUseCase } from '@/modules/classroom/use-case/createClassroom.use-case';
import { TX } from '@/types/prisma/PrismaTransaction';
import { ClassGrade } from '@repo/db/prisma/enums';

export class ClassroomSeed2 {
  constructor(private readonly createClassroomUseCase: CreateClassroomUseCase) {}
  run = async (params: { schoolId: string; input: { grade: ClassGrade; name: string } }, tx?: TX) => {
    const { schoolId, input } = params;
    const client = tx ?? prisma;

    const fakeClassroom = await client.classroom.findUnique({
      where: {
        schoolId_name_grade: {
          schoolId,
          name: input.name,
          grade: input.grade,
        },
      },
    });

    if (fakeClassroom) {
      return fakeClassroom;
    }
    return await this.createClassroomUseCase.execute({ input: { ...input, description: null }, schoolId });
  };
}
