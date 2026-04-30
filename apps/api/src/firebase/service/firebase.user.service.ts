import { firebaseSession } from '@/bootstrap/firebase.init';
import { logger } from '@/bootstrap/logger.init';
import { SafeResponse } from '@/types/in/SafeResponse';
import { UserRecord } from 'firebase-admin/auth';
import { handleFirebaseError, isFirebaseError } from '../err/firebase.errors';

class FirebaseUserService {
  private firebaseSession = firebaseSession;

  safeGetUserByEmail = async (email: string): Promise<SafeResponse<UserRecord, 'User not found'>> => {
    try {
      const userRecord = await this.firebaseSession.getUserByEmail(email);
      return {
        success: true,
        data: userRecord,
      };
    } catch (error: unknown) {
      if (isFirebaseError(error) && error.code === 'auth/user-not-found') {
        return {
          success: false,
          error: 'User not found' as const,
        };
      }
      if (isFirebaseError(error)) {
        handleFirebaseError(error);
      }
      logger.error(error, 'Unexpected safeGetUserByEmail error:');
      throw error;
    }
  };

  createAccount = async ({
    email,
    password,
    displayName,
  }: {
    email: string;
    password: string;
    displayName?: string;
  }): Promise<UserRecord> => {
    try {
      const userExists = await this.safeGetUserByEmail(email);
      if (userExists.success) {
        // ! not quite my tempo, this will return the existed user in the auth provider to continue the flow and create the user, better than throwing an erro but the password will still whatever it was set to before
        return userExists.data;
      }

      const userRecord = await this.firebaseSession.createUser({
        email,
        password,
        ...(displayName && { displayName }),
      });

      return userRecord;
    } catch (error: unknown) {
      if (isFirebaseError(error)) handleFirebaseError(error);

      logger.error(error, 'Unexpected createUser error:');
      throw error;
    }
  };

  findOrCreateAccount = async ({
    email,
    password,
    displayName,
  }: {
    email: string;
    password: string | null;
    displayName?: string;
  }): Promise<{ userRecord: UserRecord; type: 'EXISTING' | 'CREATED' }> => {
    try {
      const userExists = await this.safeGetUserByEmail(email);
      if (userExists.success) return { userRecord: userExists.data, type: 'EXISTING' } as const;

      const userRecord = await this.firebaseSession.createUser({
        email,
        password: password ?? '12345678',
        displayName,
      });

      return { userRecord, type: 'CREATED' } as const;
    } catch (error: unknown) {
      if (isFirebaseError(error)) handleFirebaseError(error);

      logger.error(error, 'Unexpected createUser error:');
      throw error;
    }
  };

  disableUser = async (authId: string): Promise<void> => {
    try {
      await this.firebaseSession.updateUser(authId, { disabled: true });
      await this.firebaseSession.revokeRefreshTokens(authId);
    } catch (error: unknown) {
      if (isFirebaseError(error)) handleFirebaseError(error);

      logger.error(error, 'Unexpected disableUser error:');
      throw error;
    }
  };

  enableUser = async (authId: string): Promise<void> => {
    try {
      await this.firebaseSession.updateUser(authId, {
        disabled: false,
      });
      await this.firebaseSession.revokeRefreshTokens(authId);
    } catch (error: unknown) {
      if (isFirebaseError(error)) handleFirebaseError(error);

      logger.error(error, 'Unexpected enableUser error:');
      throw error;
    }
  };

  deleteUser = async (authId: string): Promise<void> => {
    try {
      await this.firebaseSession.deleteUser(authId);
      await this.firebaseSession.revokeRefreshTokens(authId);
    } catch (error: unknown) {
      if (isFirebaseError(error)) handleFirebaseError(error);

      logger.error(error, 'Unexpected deleteUser error:');
      throw error;
    }
  };

  deleteAllUsers = async () => {
    let nextPageToken: string | undefined = undefined;

    do {
      const result = await this.firebaseSession.listUsers(1000, nextPageToken);

      const uids = result.users.map((user) => user.uid);

      if (uids.length > 0) {
        await this.firebaseSession.deleteUsers(uids);
      }

      nextPageToken = result.pageToken;
    } while (nextPageToken);
  };
}

export const firebaseUserService = new FirebaseUserService();
