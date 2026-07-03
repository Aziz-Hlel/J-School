import { RepoKnownErrors } from '@/err/repo/DbError';
import { ConflictError, NotFoundError } from '@/err/service/customErrors';
import { PageMapper } from '@/helper/page.mapper';
import { TX } from '@/types/prisma/PrismaTransaction';
import { Page } from '@repo/contracts/schemas/page/Page';
import { ParentResponse } from '@repo/contracts/schemas/parent/parentResponse';
import { ParentsQueryParamsTypes } from '@repo/contracts/schemas/parent/queryParams';
import { UpdateSimpleUserRequest } from '@repo/contracts/schemas/user/updateSimpleUserRequest';
import prisma from '@repo/db';
import { Prisma } from '@repo/db/prisma/client';
import { UserService } from '../User/user.service';
import includeUserAndAvatar from './includes/includeUserAndAvatar';
import { ParentMapper } from './parent.mapper';
import { ParentRepo } from './parent.repo';

export class ParentService {
  constructor(
    private readonly parentRepo: ParentRepo,
    private readonly userService: UserService,
  ) {}

  create = async (params: { userId: string; schoolId: string }, tx?: TX) => {
    try {
      const createdParent = await this.parentRepo.create(params, tx);
      return createdParent;
    } catch (error) {
      if (error instanceof RepoKnownErrors.ConflictError) {
        throw new ConflictError({ message: 'Parent already exists', cause: error });
      }
      if (error instanceof RepoKnownErrors.NotFoundError) {
        throw new NotFoundError({ message: 'Parent not found', cause: error });
      }
      throw error;
    }
  };

  findOrCreate = async (params: { userId: string; schoolId: string }, tx?: TX) => {
    const { userId, schoolId } = params;
    try {
      const parent = await this.parentRepo.findByUserId({ userId, schoolId }, tx);
      if (parent) {
        return { parent, type: 'EXISTING' } as const;
      }
      const createdParent = await this.parentRepo.create(params, tx);
      return { parent: createdParent, type: 'NEW' } as const;
    } catch (error) {
      if (error instanceof RepoKnownErrors.NotFoundError) {
        throw new NotFoundError({ message: 'Parent not found', cause: error });
      }
      throw error;
    }
  };

  update = async (params: { input: UpdateSimpleUserRequest; parentId: string; schoolId: string }) => {
    const { input, parentId, schoolId } = params;
    console.log('parent id ', parentId);
    const parent = await prisma.parent.findUnique({
      where: {
        id: parentId,
      },
      select: {
        user: {
          select: {
            id: true,
          },
        },
      },
    });
    console.log('parnt : ', parent);
    if (!parent) throw new NotFoundError({ message: 'Parent not found' });
    const updatedUser = await this.userService.updateSimpleUser({ input, userId: parent.user.id, schoolId });
    return updatedUser;
  };

  getByIdAndSchoolId = async (params: { parentId: string; schoolId: string }, tx?: TX) => {
    try {
      const parent = await this.parentRepo.getByIdAndSchoolId(params, tx);
      return parent;
    } catch (error) {
      if (error instanceof RepoKnownErrors.NotFoundError) {
        throw new NotFoundError({ message: 'Parent not found', cause: error });
      }
      throw error;
    }
  };

  findById = async (params: { parentId: string; schoolId: string }) => {
    const { parentId } = params;
    const queryResponse = await prisma.parent.findUnique({
      where: {
        id: parentId,
      },
      include: includeUserAndAvatar,
    });

    if (!queryResponse) throw new NotFoundError({ message: 'Parent not found' });
    const response = ParentMapper.toParentResponse(queryResponse);
    return response;
  };

  findAll = async (params: {
    queryParams: ParentsQueryParamsTypes['Query'];
    schoolId: string;
  }): Promise<Page<ParentResponse>> => {
    const { queryParams, schoolId } = params;

    const skip = (queryParams.page - 1) * queryParams.size;
    const take = queryParams.size;

    const where: Prisma.ParentWhereInput = { user: { schoolId } };

    if (queryParams.search && queryParams.search.trim().length > 0) {
      const searchValue = queryParams.search.trim().toLowerCase();
      where.OR = [
        { user: { firstName: { contains: searchValue, mode: 'insensitive' } } },
        { user: { lastName: { contains: searchValue, mode: 'insensitive' } } },
      ];
    }

    const orderBy: Prisma.ParentOrderByWithRelationInput = {};

    if (queryParams.sortBy) {
      orderBy.user = {
        [queryParams.sortBy]: queryParams.order,
      };
    }

    const query = prisma.parent.findMany({
      skip,
      take,
      where,
      include: includeUserAndAvatar,
      orderBy,
    });

    const count = prisma.parent.count({
      where,
    });

    const [queryResult, totalElements] = await Promise.all([query, count]);

    const parentRepsonse = queryResult.map((parent) => ParentMapper.toParentResponse(parent));
    const pageResponse = PageMapper.toPage<ParentResponse>({
      data: parentRepsonse,
      totalElements,
      pagination: queryParams,
    });

    return pageResponse;
  };
}
