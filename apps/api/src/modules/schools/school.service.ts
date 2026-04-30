import { OwnerService } from '@/modules/owner/owner.service';
import { SchoolRepo } from './school.repo';
import { prisma } from '@/bootstrap/db.init';
import { CreateSchoolRequest } from '@repo/contracts/schemas/school/createSchoolRequest';
import { SchoolMapper } from './school.mapper';

export class SchoolService {
  constructor(
    private readonly schoolRepo: SchoolRepo,
    private readonly ownerService: OwnerService,
  ) {}

  create = async ({ schema, ownerId }: { schema: CreateSchoolRequest; ownerId: string }) => {
    const slug = `${schema.nameEn.toLowerCase().replace(/\s+/g, '-')}-${Math.floor(Math.random() * 10000)}`;
    const createSchoolPayload = SchoolMapper.toCreateSchoolPayload({ schema, slug });
    const createdSchool = await this.schoolRepo.create({ payload: createSchoolPayload, ownerId });
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
