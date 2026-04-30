import ENV from '@/config/env';
import { initializeApp, getApps, getApp, cert, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const initializeFirebaseApp = (): App => {
  try {
    const serviceAccount = JSON.parse(ENV.FIREBASE_CERT);

    const app = getApps().length ? getApp() : initializeApp({ credential: cert(serviceAccount) });
    console.log('✅ SUCCESS : Firebase initialized successfully.');
    return app;
  } catch (err) {
    if (err instanceof SyntaxError)
      console.error('❌ FATAL: Could not parse FIREBASE_CERT JSON, FIREBASE_CERT is Malformed.');
    else console.error('❌ ERROR : Invalid FIREBASE_CERT:', err);
    process.exit(1);
  }
};

const app = initializeFirebaseApp();

export const firebaseSession = getAuth(app);
