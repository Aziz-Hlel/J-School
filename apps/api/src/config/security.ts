import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

export function configureSecurity() {
  return [
    helmet(), // secure headers
    rateLimit({
      windowMs: 60 * 1000, // 1 minute
      max: 100,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  ];
}
