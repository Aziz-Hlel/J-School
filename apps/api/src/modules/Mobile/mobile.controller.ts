import type { VersionPolicyResponse } from '@repo/contracts/schemas/Mobile/versionPolicyResponse';
import type { Request, Response } from 'express';
import { MobileService } from './mobile.service';

export class MobileController {
  constructor(private readonly service: MobileService) {}

  async getAndroidVersion(_: Request, res: Response<VersionPolicyResponse>) {
    const version = this.service.getAppVersion('android');
    res.status(200).json(version);
  }

  async getIosVersion(_: Request, res: Response<VersionPolicyResponse>) {
    const version = this.service.getAppVersion('ios');
    res.status(200).json(version);
  }
}
