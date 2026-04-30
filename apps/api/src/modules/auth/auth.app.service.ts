import { NotFoundError, UnauthorizedError } from '@/err/service/customErrors';
import { firebaseAuthService } from '@/firebase/service/firebase.auth.service';
import { AccountRole } from '@repo/db/prisma/enums';
import { globalMediaService } from '@/media/media.service';
import { DecodedIdTokenWithClaims } from '@/types/auth/DecodedTokenWithClaims';
import { AuthResponse } from '@repo/contracts/schemas/auth/authResponse';
import { AccountMapper } from '../accounts/account.mapper';
import { AccountService } from '../accounts/account.service';

export class AuthAppService {
  constructor(private readonly accountService: AccountService) {}

  async authWithPassword(token: string) {
    const decodedToken = await firebaseAuthService.verifyTokenWithClaims(token);

    const userAuthId = decodedToken.uid;

    const account = await this.accountService.findByAuthId(userAuthId);

    if (!account) {
      await this.accountService.create({
        uid: decodedToken.uid,
        email: decodedToken.email,
        role: AccountRole.USER,
        provider: decodedToken.firebase.sign_in_provider,
        isEmailVerified: decodedToken.email_verified,
      });

      // * thrown just to make 7amma happy
      throw new NotFoundError({
        message: 'Account not found',
        clientMessage: 'Your Email is not registered with any school',
        internalLog: 'Account created, but thrown error since it has no users',
      });
    }

    if (account.users.length === 0 && account.role === AccountRole.USER) {
      // * thrown just to make 7amma happy
      throw new NotFoundError({
        message: `Account Not found`,
        internalLog: 'Account exists but send 404 since it has no users',
      });
    }
    const accountAvatar = globalMediaService.generateMediaResponse(account.avatar);

    const accountResponse = AccountMapper.toAuthResponse({ account, avatar: accountAvatar });

    return accountResponse;
  }

  async authWithProvider(token: string): Promise<AuthResponse> {
    const decodedToken = await firebaseAuthService.verifyToken(token);

    const userAuthId = decodedToken.uid;

    const account = await this.accountService.findByAuthIdWithAllGraph(userAuthId);

    if (!account) {
      await this.accountService.create({
        uid: decodedToken.uid,
        email: decodedToken.email,
        role: AccountRole.USER,
        provider: decodedToken.firebase.sign_in_provider,
        isEmailVerified: decodedToken.email_verified,
      });

      // * thrown just to make 7amma happy
      throw new NotFoundError({
        message: 'Account not found',
        clientMessage: 'Your Email is not registered with any school',
        internalLog: 'Account created, but thrown error since it has no users',
      });
    }

    if (account.users.length === 0 && account.role === AccountRole.USER) {
      // * thrown just to make 7amma happy
      throw new NotFoundError({
        message: `Account Not found`,
        internalLog: 'Account exists but send 404 since it has no users',
      });
    }

    const accountAvatar = globalMediaService.generateMediaResponse(account.avatar);

    const accountResponse = AccountMapper.toAuthResponse({ account, avatar: accountAvatar });

    return accountResponse;
  }

  me = async (decodedToken: DecodedIdTokenWithClaims): Promise<AuthResponse> => {
    const userAuthId = decodedToken.uid;
    const account = await this.accountService.findByAuthIdWithAllGraph(userAuthId);
    if (!account) {
      throw new NotFoundError({
        message: 'Account not found',
        clientMessage: 'Your Email is not registered with any school',
        internalLog: 'Account not found',
      });
    }

    if (account.users.length === 0 && account.role === AccountRole.USER) {
      // * thrown just to make 7amma happy
      throw new NotFoundError({
        message: `Account Not found`,
        internalLog: 'Account exists but send 404 since it has no users',
      });
    }

    const isValidClaims = firebaseAuthService.validateClaims({ account, token: decodedToken });
    if (!isValidClaims) {
      throw new UnauthorizedError({
        message: `Unauthorized`,
        internalLog: { cause: 'Invalid claims', claims: decodedToken.claims },
      });
    }

    const accountAvatar = globalMediaService.generateMediaResponse(account.avatar);
    const accountResponse = AccountMapper.toAuthResponse({ account, avatar: accountAvatar });
    return accountResponse;
  };
}
