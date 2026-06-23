import { ConflictError, ForbiddenError, NotFoundError } from '@/err/service/customErrors';
import { DecodedIdTokenWithClaims } from '@/types/auth/DecodedTokenWithClaims';
import { CreateSchoolRequest } from '@repo/contracts/schemas/school/createSchoolRequest';
import { UpdateSchoolRequest } from '@repo/contracts/schemas/school/updateSchoolRequest';
import { SchoolMapper } from './school.mapper';
import { SchoolRepo } from './school.repo';
// import { School } from '@repo/db/prisma/client';
import { SelectClassroomsRes } from '@repo/contracts/schemas/classroom/SelectClassroomsRes';
import { GetMySchoolResponse } from '@repo/contracts/schemas/school/getMySchoolResponse';
import prisma from '@repo/db';
import { OwnerService } from '../owner/owner.service';
import { SchoolService } from './school.service';

export class SchoolAppService {
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

  selectClassrooms = async (params: { schoolId: string }): Promise<SelectClassroomsRes[]> => {
    const queryResponse = await prisma.classroom.findMany({
      where: {
        schoolId: params.schoolId,
      },
      orderBy: [
        {
          grade: 'asc',
        },
        {
          name: 'asc',
        },
      ],
      select: {
        id: true,
        name: true,
        grade: true,
      },
    });
    return queryResponse;
  };

  selectParents = async () => {
    const queryResponse = await prisma.user.findMany({
      select: {
        id: true,

        phone: true,
      },
      orderBy: [
        {
          firstName: 'asc',
        },
        {
          lastName: 'asc',
        },
      ],
    });
    return queryResponse;
  };
}
