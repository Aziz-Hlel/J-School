import { RepoKnownErrors } from '@/err/repo/DbError';
import { ConflictError, NotFoundError } from '@/err/service/customErrors';
import { TX } from '@/types/prisma/PrismaTransaction';
import { ParentsQueryParamsTypes } from '@repo/contracts/schemas/parent/queryParams';
import prisma from '@repo/db';
import { Prisma } from '@repo/db/prisma/client';
import includeUserAndAvatar from './includes/includeUserAndAvatar';
import { ParentMapper } from './parent.mapper';
import { ParentRepo } from './parent.repo';

export class ParentService {
  constructor(private readonly parentRepo: ParentRepo) {}

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

  update = async (
    params: { input: { emergencyPhone: string | null }; parentId: string; schoolId: string },
    tx?: TX,
  ) => {
    try {
      const updatedParent = await this.parentRepo.update(params, tx);
      return updatedParent;
    } catch (error) {
      if (error instanceof RepoKnownErrors.NotFoundError) {
        throw new NotFoundError({ message: 'Parent not found', cause: error });
      }
      throw error;
    }
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

  findAll = async (params: { queryParams: ParentsQueryParamsTypes['Query']; schoolId: string }) => {
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

    return { content: parentRepsonse, totalElements };
  };
}
