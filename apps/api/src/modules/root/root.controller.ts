import { Request, Response } from 'express';
import { SimpleApiResponse } from '@repo/contracts/types/api/SimpleApiResponse.dto';
import { HealthzResponseDto } from './schemas/healthzResponse.dto';
import { RootAppService } from './root.app.service';

export class RootController {
  constructor(private readonly rootAppService: RootAppService) {}
  getHealth = async (req: Request, res: Response<SimpleApiResponse>) => {
    res.json({ message: 'i feel good !' });
  };

  getHealthz = async (req: Request, res: Response<HealthzResponseDto>) => {
    res.json({
      success: true,
      message: 'i feel good !',
      timestamp: new Date(),
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
    });
  };

  hardReset = async (req: Request, res: Response<SimpleApiResponse>) => {
    await this.rootAppService.resetAuthAndDB();
    res.json({ message: 'DB and Auth reset successfully!' });
  };
}
