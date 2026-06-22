import ENV from '@/config/env';
import { VersionPolicyResponse } from '@repo/contracts/schemas/Mobile/versionPolicyResponse';

export class MobileService {
  constructor() {}
  getAppVersion(platform: 'ios' | 'android'): VersionPolicyResponse {
    if (platform === 'ios') {
      return { minSupportedVersion: ENV.IOS_MIN_SUPPORTED_VER };
    }
    return { minSupportedVersion: ENV.ANDROID_MIN_SUPPORTED_VER };
  }
}
