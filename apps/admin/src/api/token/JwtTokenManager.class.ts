import { firebaseConfig } from '@/config/firebase';
import { getApps, initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signOut, type Auth, type User } from 'firebase/auth';

class JwtTokenManager {
  private auth: Auth;
  private currentUser: User | null = null;
  private initializing: Promise<void>;

  // ! bullshit solution, had to add this below , probably some race condition thing, this code get excuted before the init firebase that s why
  constructor() {
    const app = getApps()[0] || initializeApp(firebaseConfig);
    this.auth = getAuth(app);
    this.initializing = new Promise((resolve) => {
      onAuthStateChanged(this.auth, (user) => {
        this.currentUser = user;
        resolve();
      });
    });
  }

  /**
   * Ensures Firebase auth is ready and returns
   * a fresh access token if available.
   */
  async getAccessToken(): Promise<string | null> {
    await this.initializing;

    if (!this.currentUser) {
      return null;
    }

    return this.currentUser.getIdToken(/* forceRefresh */ false);
  }

  /**
   * Forces Firebase to issue a new token.
   * Use after login or OAuth flow.
   */
  async refreshAccessToken(): Promise<string | null> {
    await this.initializing;

    if (!this.currentUser) {
      return null;
    }

    return this.currentUser.getIdToken(true);
  }

  /**
   * Called after successful Firebase sign-in.
   * Keeps manager state in sync.
   */
  async onLogin(): Promise<void> {
    await this.refreshAccessToken();
  }

  /**
   * Clears auth session completely.
   */
  async clearTokens(): Promise<void> {
    this.currentUser = null;
    await signOut(this.auth);
  }

  /**
   * Used during app bootstrap to detect auth state.
   */
  async hasSession(): Promise<boolean> {
    await this.initializing;
    return Boolean(this.currentUser);
  }
}

export const jwtTokenManager = new JwtTokenManager();
