// import { SchoolGetPayload } from '@repo/db/prisma/models';
import { globalMediaService } from '@/media/media.service';
import { CreateSchoolRequest } from '@repo/contracts/schemas/school/createSchoolRequest';
import { GetMySchoolResponse } from '@repo/contracts/schemas/school/getMySchoolResponse';
import { SchoolPlan } from '@repo/db/prisma/enums';
import { SchoolGetPayload } from '@repo/db/prisma/models';
import { CreateSchoolPayload } from './types/createSchoolPayload';

export class SchoolMapper {
  static toCreateSchoolPayload = ({
    schema,
    slug,
  }: {
    schema: CreateSchoolRequest;
    slug: string;
  }): CreateSchoolPayload => {
    return {
      ...schema,
      slug,
      plan: SchoolPlan.FREE,
    };
  };

  static toGetMySchoolResponse = (school: SchoolGetPayload<{ include: { logo: true } }>): GetMySchoolResponse => {
    const logoResponse = globalMediaService.toMediaRes(school.logo);
    return {
      id: school.id,
      nameEn: school.nameEn,
      nameAr: school.nameAr,
      nameFr: school.nameFr,
      slug: school.slug,
      logo: logoResponse,
      address: school.address,
      phone: school.phone,
      email: school.email,
      website: school.website,
      description: school.description,
      status: school.status,
      createdAt: school.createdAt.toISOString(),
      updatedAt: school.updatedAt.toISOString(),
    };
  };
}
