import ENV from '@/config/env';
import { VersionPolicyResponse } from '@repo/contracts/schemas/Mobile/versionPolicyResponse';

export class MobileService {
  getAppVersion(platform: 'ios' | 'android'): VersionPolicyResponse {
    console.log('ousil');
    if (platform === 'ios') {
      return { minSupportedVersion: ENV.IOS_MIN_SUPPORTED_VER };
    }
    return { minSupportedVersion: ENV.ANDROID_MIN_SUPPORTED_VER };
  }
}
