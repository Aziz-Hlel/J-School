import { CreateSchoolRequest } from '@repo/contracts/schemas/school/createSchoolRequest';
import { SchoolPlan } from '@repo/db/prisma/enums';

export type CreateSchoolPayload = CreateSchoolRequest & {
  slug: string;
  plan: SchoolPlan;
};
