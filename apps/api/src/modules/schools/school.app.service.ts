import { ConflictError, ForbiddenError, NotFoundError } from '@/err/service/customErrors';
import { DecodedIdTokenWithClaims } from '@/types/auth/DecodedTokenWithClaims';
import { CreateSchoolRequest } from '@repo/contracts/schemas/school/createSchoolRequest';
import { UpdateSchoolRequest } from '@repo/contracts/schemas/school/updateSchoolRequest';
import { SchoolMapper } from './school.mapper';
import { SchoolRepo } from './school.repo';
// import { School } from '@repo/db/prisma/client';
import { GetMySchoolResponse } from '@repo/contracts/schemas/school/getMySchoolResponse';
import { School } from '@repo/db/prisma/client';
import { OwnerService } from '../owner/owner.service';
import { SchoolService } from './school.service';

export interface ISchoolAppService {
  create: (params: { schema: CreateSchoolRequest; token: DecodedIdTokenWithClaims }) => Promise<School>;
  update: (params: { schema: UpdateSchoolRequest; schoolId: string; accountId: string }) => Promise<void>;
  getMySchool: (params: { token: DecodedIdTokenWithClaims }) => Promise<GetMySchoolResponse>;
  getById: (params: { schoolId: string; token: DecodedIdTokenWithClaims }) => Promise<void>;
  getPage: (params: { schema: any; token: DecodedIdTokenWithClaims }) => Promise<void>;
  delete: (params: { schoolId: string; token: DecodedIdTokenWithClaims }) => Promise<void>;
}

export class SchoolAppService implements ISchoolAppService {
  constructor(
    private readonly schoolRepo: SchoolRepo,
    private readonly schoolService: SchoolService,
    private readonly ownerService: OwnerService,
  ) {}

  create = async ({ schema, token }: { schema: CreateSchoolRequest; token: DecodedIdTokenWithClaims }) => {
    const owner = await this.ownerService.findByAccountId(token.claims.accountId);
    if (!owner) {
      throw new ForbiddenError('You are not allowed to create a school');
    }
    const schoolExists = await this.schoolService.existByOwnerId(owner.id);
    if (schoolExists) {
      throw new ConflictError('Account already has a school');
    }

    const createdSchool = await this.schoolService.create({ schema, ownerId: owner.id });
    return createdSchool;
  };

  update = async ({
    schema,
    schoolId,
    accountId,
  }: {
    schema: UpdateSchoolRequest;
    schoolId: string;
    accountId: string;
  }) => {
    const school = await this.schoolService.findByIdAndAccountId(schoolId, accountId);
    if (!school) {
      throw new NotFoundError({
        message: 'School not found',
        internalLog: {
          message: `School with id ${schoolId} not found or not owned by account ${accountId}`,
          explanation: 'Either school doesnt exists, account doesnt exists or account doesnt own the school',
        },
      });
    }

    await this.schoolRepo.update({ payload: schema, schoolId });
  };

  getMySchool = async ({ token }: { token: DecodedIdTokenWithClaims }): Promise<GetMySchoolResponse> => {
    const school = await this.schoolService.getByAccountIdWithLogo(token.claims.accountId);
    if (!school) {
      throw new NotFoundError('School not found');
    }
    const schoolResponse = SchoolMapper.toGetMySchoolResponse(school);
    return schoolResponse;
  };

  getById = async ({}: { schoolId: string; token: DecodedIdTokenWithClaims }) => {
    throw new Error('Method not implemented.');
  };

  getPage = async ({}: { schema: any; token: DecodedIdTokenWithClaims }) => {
    throw new Error('Method not implemented.');
  };

  delete = async ({}: { schoolId: string; token: DecodedIdTokenWithClaims }) => {
    throw new Error('Method not implemented.');
  };
}
