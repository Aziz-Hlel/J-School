import { SimpleApiResponse } from '@repo/contracts/types/api/SimpleApiResponse.dto';
import { Request, Response } from 'express';
import { RootAppService } from './root.app.service';
import { HealthzResponseDto } from './schemas/healthzResponse.dto';

export class RootController {
  constructor(private readonly rootAppService: RootAppService) {}
  getHealth = async (_: Request, res: Response<SimpleApiResponse>) => {
    res.json({ message: 'i feel good !' });
  };

  getHealthz = async (_: Request, res: Response<HealthzResponseDto>) => {
    res.json({
      success: true,
      message: 'i feel good !',
      timestamp: new Date(),
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
    });
  };

  hardReset = async (_: Request, res: Response<SimpleApiResponse>) => {
    await this.rootAppService.resetAuthAndDB();
    res.json({ message: 'DB and Auth reset successfully!' });
  };
}
