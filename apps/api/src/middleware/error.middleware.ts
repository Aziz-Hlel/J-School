import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../err/service/customErrors';
import { ApiError } from '../err/apiError.type';
import { logger } from '../bootstrap/logger.init';
import { serializeUnknownError } from '@/utils/serializeUnknownError';
import { handleZodError } from '@/err/validator/handleZodError';
import { RepoError } from '@/err/repo/DbError';

export const globalErrorHandler = (error: Error, req: Request, res: Response<ApiError>, next: NextFunction) => {
  const path = req.originalUrl;
  // Zod validation errors
  if (error instanceof ZodError) {
    const apiError = handleZodError(error, req);
    logger.warn({ err: { ...error, message: JSON.parse(error.message) }, path }, 'Validation error');
    return res.status(400).json(apiError);
  }

  // Business logic errors
  if (error instanceof AppError) {
    const serializedCause = error.cause ? serializeUnknownError(error.cause) : undefined;
    logger.warn({ error, path, cause: serializedCause }, 'Application error');
    return res.status(error.status).json(AppError.toApiErrorResponse(error, req));
  }

  // Repo errors
  if (error instanceof RepoError) {
    const serializedCause = error.cause ? serializeUnknownError(error.cause) : undefined;
    logger.warn(
      { error, path, cause: serializedCause },
      'Repo error : This type of error should not transform to ApiError',
    );
    return res.status(error.type.status).json(RepoError.toApiErrorResponse(error, req));
  }

  // Database errors
  if (error.constructor.name.includes('Prisma')) {
    logger.error(
      { err: error, path },
      'Database error : If you see this, it means that the error was not caught by the repo layer',
    );
    return res.status(400).json({
      success: false,
      message: 'Database operation failed',
      timestamp: new Date(),
      path: path,
    });
  }

  // Default 500
  logger.fatal({ err: error, path }, 'Unhandled error');
  return res.status(500).json({
    success: false,
    message: 'Internal server error, unhandled error type',
    timestamp: new Date(),
    path: path,
  });
};
