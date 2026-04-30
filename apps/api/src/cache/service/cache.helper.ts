import { UserPageQuery } from '@repo/contracts/schemas/user/UserPageQuery';

export class CacheHelper {
  normalizeUserPageParams(params: UserPageQuery): UserPageQuery {
    return {
      ...params,
    };
  }
}
