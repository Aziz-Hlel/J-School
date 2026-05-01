import cors from 'cors';
import ENV from './env';
import { isAllowedOriginPatternsExist } from './env/NodeEnvs';

export function configureCors() {
  return cors({
    origin: isAllowedOriginPatternsExist(ENV) ? ENV.ALLOWED_ORIGIN_PATTERNS : '*',

    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    exposedHeaders: ['Content-Length'],
    credentials: true,
    maxAge: 86400, // cache preflight for 24h
  });
}
