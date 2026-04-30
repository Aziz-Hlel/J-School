import { Prisma } from '@repo/db/prisma/client';
import { PrismaErrorCode } from './PrismaErrorCode';
import { repoErrors, RepoErrorDefaults } from './DbErrorName';
import { ApiError } from '../apiError.type';
import ENV from '@/config/env';
import { Request } from 'express';

export class RepoError extends Error {
  type: RepoErrorDefaults;
  cause?: Error;

  constructor({ cause, type }: { cause: Error; type: RepoErrorDefaults }) {
    super(cause.message, { cause });
    this.cause = cause;
    this.type = type;
  }

  static throwRepoError(error: unknown): never {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError)) throw error;
    if (error.code === PrismaErrorCode.UNIQUE_CONSTRAINT) throw new RepoKnownErrors.ConflictError({ cause: error });
    if (error.code === PrismaErrorCode.NOT_FOUND) throw new RepoKnownErrors.NotFoundError({ cause: error });
    throw new UnhandledDbError({ cause: error });
  }

  static toApiErrorResponse(error: RepoError, req: Request): ApiError {
    const apiResponse: ApiError = {
      success: false,
      message: error.message,
      timestamp: new Date(),
      path: req.originalUrl,
    };
    if (ENV.NODE_ENV !== 'production') {
      apiResponse.stack = error.stack;
      apiResponse.cause = error.cause;
    }
    return apiResponse;
  }
}

export class ConflictError extends RepoError {
  static type = repoErrors.CONFLICT;
  constructor({ cause }: { cause: Error }) {
    super({ cause, type: ConflictError.type });
  }
}

export class NotFoundError extends RepoError {
  static type = repoErrors.NOT_FOUND;
  constructor({ cause }: { cause: Error }) {
    super({ cause, type: NotFoundError.type });
  }
}

export class UnhandledDbError extends RepoError {
  static type = repoErrors.UNHANDLED_DB_ERROR;
  constructor({ cause }: { cause: Error }) {
    super({ cause, type: UnhandledDbError.type });
  }
}

export const RepoKnownErrors = {
  ConflictError,
  NotFoundError,
};

export type RepoKnownErrors = (typeof RepoKnownErrors)[keyof typeof RepoKnownErrors];
