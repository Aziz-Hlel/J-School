import ENV from '@/config/env';
import { AuthenticatedRequest } from '@/types/auth/AuthenticatedRequest';
import { claimsSchema } from '@/types/token/Claims';
import { NextFunction, Request, Response } from 'express';

const validateClaimsSchemaMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (ENV.NODE_ENV !== 'dev') return next();
  const claims = (req as AuthenticatedRequest).token?.claims;
  if (!claims) return next();
  claimsSchema.parse(claims);
  next();
};

export default validateClaimsSchemaMiddleware;
