import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';

export type StrictDecodedIdToken = {
  [K in keyof DecodedIdToken as string extends K ? never : number extends K ? never : K]: DecodedIdToken[K];
};
