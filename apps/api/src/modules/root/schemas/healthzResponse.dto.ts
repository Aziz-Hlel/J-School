export type HealthzResponseDto = {
  success: boolean;
  message: string;
  timestamp: Date;
  uptime: number;
  memoryUsage: NodeJS.MemoryUsage;
};
