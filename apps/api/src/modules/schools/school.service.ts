import { prisma } from '@/bootstrap/db.init';
import { OwnerService } from '@/modules/owner/owner.service';
import { TX } from '@/types/prisma/PrismaTransaction';
import { initSubjectsWithExamsPerGrade } from '@repo/contracts/const/subjectAndExams/index';
import { CreateSchoolRequest } from '@repo/contracts/schemas/school/createSchoolRequest';
import { ClassGrade } from '@repo/db/prisma/browser';
import { SchoolMapper } from './school.mapper';
import { SchoolRepo } from './school.repo';

export class SchoolService {
  constructor(
    private readonly schoolRepo: SchoolRepo,
    private readonly ownerService: OwnerService,
  ) {}

  createSubjects = async ({ schoolId }: { schoolId: string }, tx: TX) => {
    const queryData = Object.entries(initSubjectsWithExamsPerGrade).flatMap(([grade, subjects]) => {
      if (Array.isArray(subjects)) return [];

      return Object.values(subjects).map((subject) => ({
        name_en: subject.subject.name.en,
        name_fr: subject.subject.name.fr,
        name_ar: subject.subject.name.ar,
        grade: grade as ClassGrade,

        hoursPerWeek: subject.subject.hoursPerWeek,
        domain: subject.subject.domain,
        schoolId,
        exams: {
          createMany: {
            data: subject.exams.map((exam) => ({
              name_en: exam.name.en,
              name_fr: exam.name.fr,
              name_ar: exam.name.ar,
              durationInMin: exam.durationInMin,
              schoolId,
            })),
          },
        },
      }));
    });
    console.log('total subjects : ', queryData.length);
    return await Promise.all(queryData.map(async (subject) => tx.subject.create({ data: subject })));
  };

  create = async ({ schema, ownerId }: { schema: CreateSchoolRequest; ownerId: string }) => {
    const slug = `${schema.nameEn.toLowerCase().replace(/\s+/g, '-')}-${Math.floor(Math.random() * 10000)}`;
    const createSchoolPayload = SchoolMapper.toCreateSchoolPayload({ schema, slug });

    const createdSchool = await prisma.$transaction(async (tx) => {
      const school = await this.schoolRepo.create({ payload: createSchoolPayload, ownerId, tx });
      await this.createSubjects({ schoolId: school.id }, tx);
      return school;
    });
    return createdSchool;
  };

  findOrCreateSchool = async ({ schema, ownerId }: { schema: CreateSchoolRequest; ownerId: string }) => {
    const school = await this.getByOwnerIdWithLogo(ownerId);
    if (school) {
      return school;
    }
    return await this.create({ schema, ownerId });
  };

  existByOwnerId = async (ownerId: string) => {
    return await this.schoolRepo.existByOwnerId(ownerId);
  };

  getByAccountIdWithLogo = async (accountId: string) => {
    return await this.schoolRepo.getByAccountId({ accountId, include: { logo: true } });
  };

  getByOwnerIdWithLogo = async (ownerId: string) => {
    return await this.schoolRepo.getByOwnerId({ ownerId, include: { logo: true } });
  };

  getByIdWithOwner = async (schoolId: string) => {
    return await this.schoolRepo.getById({ schoolId, include: { owner: true } });
  };

  findByIdAndAccountId = async (schoolId: string, accountId: string) => {
    const school = await prisma.school.findUnique({
      where: {
        id: schoolId,
        owner: {
          accountId,
        },
      },
    });
    return school;
  };
}
