import { prisma } from '@/bootstrap/db.init';
import { ClassGrade } from '@repo/db/prisma/enums';
import { ClassroomUncheckedCreateInput } from '@repo/db/prisma/models';
import { TX } from '@/types/prisma/PrismaTransaction';
import { faker } from '@faker-js/faker';

export class ClassroomSeed {
  generateFakeClassroom = ({ schoolId, classGrade }: { schoolId: string; classGrade: ClassGrade }) => {
    return {
      schoolId,
      name: faker.lorem.words(2),
      grade: classGrade,
      description: faker.lorem.words(10),
    } satisfies ClassroomUncheckedCreateInput;
  };

  run = async (params: { schoolId: string }, tx?: TX) => {
    const { schoolId } = params;
    const client = tx ?? prisma;

    const classQueries = Object.values(ClassGrade).map((classGrade) => {
      const fakeClassroom = this.generateFakeClassroom({ schoolId, classGrade });
      return client.classroom.upsert({
        where: {
          schoolId_name_grade: {
            schoolId,
            name: fakeClassroom.name,
            grade: fakeClassroom.grade,
          },
        },
        create: fakeClassroom,
        update: {},
      });
    });
    await Promise.all(classQueries);
  };
}
