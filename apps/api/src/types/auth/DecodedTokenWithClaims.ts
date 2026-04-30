import { Claims } from '../token/Claims';
import { StrictDecodedIdToken } from './StrictDecodedIdToken';

export type DecodedIdTokenWithClaims = StrictDecodedIdToken & { claims: Claims };
