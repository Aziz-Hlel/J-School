import type { AccountResponse } from '../account/accountResponse';
import type { UserSimpleResponse } from './UserSimpleResponse';

export type UserFullResponse = {
  account: AccountResponse;
  user: UserSimpleResponse;
};
