import type { UserFullResponse } from '../user/UserFullResponse';
import type { ProfileResponse } from './ProfileResponse';

export type UserProfileResponse = UserFullResponse & { profile: ProfileResponse | null };
