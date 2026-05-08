import { DecodedIdToken } from 'firebase-admin/auth';

export type StrictDecodedIdToken = {
  [K in keyof DecodedIdToken as string extends K ? never : number extends K ? never : K]: DecodedIdToken[K];
};
