import ENV from '@/config/env';
import { Prisma } from '@repo/db/prisma/client';
import { Request } from 'express';
import { ApiError } from '../apiError.type';
import { RepoErrorDefaults, repoErrors } from './DbErrorName';

export class RepoError_V2 extends Error {
  type: RepoErrorDefaults;
  cause?: Error;

  constructor({ cause, type }: { cause: Error; type: RepoErrorDefaults }) {
    super(cause.message, { cause });
    this.cause = cause;
    this.type = type;
  }

  static handleRepoError(error: unknown): never {
    if (!(error instanceof Error)) throw error;
    // * you can handle some unkow prisma errors afterwards like throwing a 501 error when db is not available and you can send a noti for that
    if (error instanceof Prisma.PrismaClientUnknownRequestError) throw new UnknownPrismaError({ cause: error });
    throw error;
  }

  static toApiErrorResponse(error: RepoError_V2, req: Request): ApiError {
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

export class UnhandledDbError extends RepoError_V2 {
  static type = repoErrors.UNHANDLED_DB_ERROR;
  constructor({ cause }: { cause: Error }) {
    super({ cause, type: UnhandledDbError.type });
  }
}

export class UnknownPrismaError extends RepoError_V2 {
  static type = repoErrors.UNKNOWN;
  constructor({ cause }: { cause: Error }) {
    super({ cause, type: UnknownPrismaError.type });
  }
}
