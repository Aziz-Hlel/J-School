import { FirebaseError } from 'firebase-admin/lib/utils/error';
import { ConflictError, InternalServerError, UnauthorizedError } from '../../err/service/customErrors';
import { logger } from '@/bootstrap/logger.init';

export const isFirebaseError = (err: unknown): err is FirebaseError => {
  return typeof err === 'object' && err !== null && 'code' in err && typeof (err as any).code === 'string';
};

export const handleFirebaseError = (error: FirebaseError, params?: { claims?: Object }): void => {
  switch (error.code) {
    case 'auth/user-disabled':
      throw new ConflictError('User account is disabled.');
    case 'auth/id-token-revoked':
      throw new ConflictError('Token has been revoked.');
    case 'auth/id-token-expired':
      throw new UnauthorizedError('Token has expired.');
    case 'auth/email-already-exists':
      throw new ConflictError('Email already exists.');

    case 'auth/claims-too-large':
      logger.fatal({ error, claims: params?.claims }, 'Firebase claims are too large.');
      throw new InternalServerError('Invalid claims.');
    default:
      break;
  }
};
