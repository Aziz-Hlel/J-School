import { authService } from '@/api/service/authService';
import { jwtTokenManager } from '@/api/token/JwtTokenManager.class';
import type { FirebaseSignInRequestDto } from '@/types/auth/SignInRequestDto';
import type { UserProfileResponse } from '@repo/contracts/schemas/profile/UserProfileResponse';
import { create } from 'zustand';

type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

type AuthStore = {
  status: AuthStatus;
  currentUser: null | UserProfileResponse;
  bootstrap: () => Promise<void>;
  login: (payload: FirebaseSignInRequestDto) => Promise<void>;
  register: (payload: FirebaseSignInRequestDto) => Promise<void>;
  oAuthLogin: (payload: FirebaseSignInRequestDto) => Promise<void>;
  logout: () => void;
};

const fetchCurrentUser = async (): Promise<UserProfileResponse | null> => {
  try {
    const response = await authService.me();
    return response.success ? response.data : null;
  } catch (error) {
    console.log('something went wrong while fetching current user', error);
    return null;
  }
};

const loginFunc = async (payload: FirebaseSignInRequestDto) => {
  try {
    const response = await authService.signIn(payload);
    return response.success ? response.data : null;
  } catch (error) {
    console.log('something went wrong while logging in', error);
    return null;
  }
};

const oAuthLoginFunc = async (payload: FirebaseSignInRequestDto) => {
  try {
    const response = await authService.oAuthSignIn(payload);
    return response.success ? response.data : null;
  } catch (error) {
    console.log('something went wrong while logging in with oAuth', error);
    return null;
  }
};

export const useAuthStore = create<AuthStore>((set) => ({
  status: 'idle',
  currentUser: null,

  bootstrap: async () => {
    set({ status: 'loading' });

    const token = await jwtTokenManager.getAccessToken();

    if (!token) {
      set({ status: 'unauthenticated' });
      return;
    }

    const user = await fetchCurrentUser();
    if (!user) {
      set({ status: 'unauthenticated' });
      return;
    }
    set({ status: 'authenticated', currentUser: user });
  },

  register: async (payload: FirebaseSignInRequestDto) => {
    set({ status: 'loading' });

    const signUpResponse = await loginFunc(payload);

    if (!signUpResponse) {
      set({ status: 'unauthenticated' });
      return;
    }

    const user = await fetchCurrentUser();

    set({ currentUser: user });
    await jwtTokenManager.refreshAccessToken();
    set({ status: 'authenticated' });
  },

  login: async (payload: FirebaseSignInRequestDto) => {
    set({ status: 'loading' });

    const signInResponse = await loginFunc(payload);

    if (!signInResponse) {
      set({ status: 'unauthenticated' });
      return;
    }

    const user = await fetchCurrentUser();

    set({ currentUser: user });
    await jwtTokenManager.refreshAccessToken();
    set({ status: 'authenticated' });
  },

  oAuthLogin: async (payload: FirebaseSignInRequestDto) => {
    set({ status: 'loading' });

    const signInResponse = await oAuthLoginFunc(payload);

    if (!signInResponse) {
      set({ status: 'unauthenticated' });
      return;
    }

    const user = await fetchCurrentUser();

    set({ currentUser: user });
    await jwtTokenManager.refreshAccessToken();
    set({ status: 'authenticated' });
  },

  logout: () => {
    jwtTokenManager.clearTokens();
    set({ status: 'unauthenticated' });
  },
}));
