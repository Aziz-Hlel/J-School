import type { Request, Response } from 'express';
import type { MobileService } from './mobile.service';

export class MobileController {
  constructor(private readonly service: MobileService) {}

  getAndroidVersion = async (_: Request, res: Response) => {
    const version = this.service.getAppVersion('android');
    res.status(200).json(version);
  };

  getIosVersion = async (_: Request, res: Response) => {
    const version = this.service.getAppVersion('ios');
    res.status(200).json(version);
  };
}
