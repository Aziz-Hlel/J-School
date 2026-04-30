import { ConflictError, NotFoundError } from '@/err/service/customErrors';
import { ParentRepo } from './parent.repo';
import { RepoKnownErrors } from '@/err/repo/DbError';
import { TX } from '@/types/prisma/PrismaTransaction';
import { UserService } from '../User/user.service';

export class ParentService {
  constructor(
    private readonly parentRepo: ParentRepo,
    private readonly userService: UserService,
  ) {}

  create = async (params: { input: { emergencyPhone: string | null }; userId: string; schoolId: string }, tx?: TX) => {
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

  findOrCreate = async (
    params: { input: { emergencyPhone: string | null }; userId: string; schoolId: string },
    tx?: TX,
  ) => {
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
}
