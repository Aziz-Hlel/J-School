import { Request } from 'express';
import { DecodedIdTokenWithClaims as DecodedTokenWithClaims } from './DecodedTokenWithClaims';

// export interface AuthenticatedRequest<
//   ReqBody = never,
//   ReqQuery extends { [key: string]: string | number } = never,
// > extends Request {
//   user: DecodedIdTokenWithClaims;
//   body: ReqBody;
//   query: ReqQuery;
// }

export interface AuthenticatedRequest extends Request {
  token: DecodedTokenWithClaims;
}
