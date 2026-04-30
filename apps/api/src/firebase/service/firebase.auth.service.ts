import { logger } from '@/bootstrap/logger.init';
import { UnauthorizedError } from '@/err/service/customErrors';
import { DecodedIdTokenWithClaims } from '@/types/auth/DecodedTokenWithClaims';
import { AccountEntityRequest } from '@/types/includes/account';
import { Auth } from 'firebase-admin/auth';
import { firebaseSession } from '../../bootstrap/firebase.init';
import { StrictDecodedIdToken } from '../../types/auth/StrictDecodedIdToken';
import { Claims, claimsSchema } from '../../types/token/Claims';
import { handleFirebaseError, isFirebaseError } from '../err/firebase.errors';
import { FirebaseMapper } from './firebase.mapper';

const MAX_CLAIMS_SIZE = 1000;

function validateClaimsSize(claims: object) {
  const json = JSON.stringify(claims);
  const size = Buffer.byteLength(json, 'utf8');

  if (size > MAX_CLAIMS_SIZE / 2) logger.warn(`Custom claims too large: ${size} bytes`);
  if (size > MAX_CLAIMS_SIZE) throw new Error(`Custom claims too large: ${size} bytes`);
}

class FirebaseAuthService {
  private firebaseSession: Auth = firebaseSession;

  private isTokenFormatValid = (token: string) => {
    return typeof token === 'string' && token.split('.').length === 3;
  };
  verifyToken = async (token: string): Promise<StrictDecodedIdToken> => {
    try {
      if (!this.isTokenFormatValid(token)) {
        logger.error({ token }, 'Invalid token format');
        throw new UnauthorizedError('Invalid token');
      }
      const firebaseToken = await this.firebaseSession.verifyIdToken(token);

      return firebaseToken;
    } catch (error: unknown) {
      if (isFirebaseError(error)) handleFirebaseError(error);

      logger.error({ error }, 'Unexpected verifyToken error:');
      throw error; // Not a Firebase error → rethrow untouched
    }
  };

  verifyTokenWithClaims = async (token: string): Promise<DecodedIdTokenWithClaims> => {
    try {
      if (!this.isTokenFormatValid(token)) {
        logger.error({ token }, 'Invalid token format');
        throw new UnauthorizedError('Invalid token');
      }
      const firebaseToken = await this.firebaseSession.verifyIdToken(token);
      this.validateClaimsSchema(firebaseToken.claims);
      return firebaseToken as DecodedIdTokenWithClaims;
    } catch (error: unknown) {
      if (isFirebaseError(error)) handleFirebaseError(error);

      logger.error({ error }, 'Unexpected verifyToken error:');
      throw error; // Not a Firebase error → rethrow untouched
    }
  };

  private setClaims = async ({ authId, claims }: { authId: string; claims: Claims }) => {
    try {
      validateClaimsSize(claims);
      await this.firebaseSession.setCustomUserClaims(authId, { claims });
      this.validateClaimsSchema(claims);
      // TODO: invalidate any token for this user issued before Date.now()
    } catch (error: unknown) {
      if (isFirebaseError(error)) handleFirebaseError(error, { claims });

      logger.error({ error }, 'Unexpected setClaims error:');
      throw error; // Not a Firebase error → rethrow untouched
    }
  };

  setNewAdminCustomClaims = async ({ authId, partialClaims: claims }: { authId: string; partialClaims: Claims }) => {
    this.setClaims({ authId, claims });
  };

  setAccountClaims = async ({ authId, claims }: { authId: string; claims: Claims }) => {
    this.setClaims({ authId, claims });
  };

  private validateClaimsSchema = (claims: Object | undefined): claims is Claims => {
    /**
     * // !
     * A very sricky situation , an account created a long time ago, with claims set long time ago too, now he s trying to login and you run this
     * if the claims schema changed in the meantime, this will fail, so we need to handle this case
     * you might need to reset it s claims to return a 401 but at the same time you dont want to return that in the login, since this one get
     * triggred in the logins too,
     * so the solution going to be is to re-set the claims to the new schema, be careful here you might run into a cicular hell if this validation
     * does not conform with the setClaims method,
     * another thing you might add a new field in the verifyToken func to trigger validation or not so you cant skip in the login and the moment he sents another
     * request post login it ll return 401 and he'll have to refresh then
     * another fuit for thought i think you might have to treat this claims and the chnaging of the claims very carefully as if it s a mogration thing
     * otherwise you can block all users from loggin into the app with a simple or stupid mistake
     */
    const result = claimsSchema.safeParse(claims);
    if (!result.success) {
      throw new UnauthorizedError({ message: 'Invalid claims schema', cause: result.error });
    }
    return true;
  };

  validateClaims = ({ account, token }: { account: AccountEntityRequest; token: StrictDecodedIdToken }) => {
    const claims = (token as any).claims as Claims;
    if (!claims) return false;
    const validClaims: Claims = FirebaseMapper.toClaims({ account });

    return JSON.stringify(claims) === JSON.stringify(validClaims);
  };
}

export const firebaseAuthService = new FirebaseAuthService();
