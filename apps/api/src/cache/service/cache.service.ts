import redis from '@/bootstrap/redis.init';
import { CacheMetrics } from './cache.metrics';
import crypto from 'crypto';

type getParams = { key: string };
type setParams<T> = { value: T; ttlSeconds: number } & getParams;

export class CacheService {
  cacheMetrics = new CacheMetrics();

  stableHash(value: unknown): string {
    return crypto.createHash('sha1').update(JSON.stringify(value)).digest('hex');
  }

  async get<T>(props: getParams): Promise<T | null> {
    const key = props.key;
    // const hashedKey = this.stableHash(value);
    try {
      const value = await redis.get(key);
      if (value) {
        this.cacheMetrics.recordHit();
        return JSON.parse(value);
      }
      this.cacheMetrics.recordMiss();
      return null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }
  async set<T>(props: setParams<T>): Promise<void> {
    const key = props.key;
    // const hashedKey = this.stableHash(key);
    try {
      await redis.set(key, JSON.stringify(props.value), 'EX', props.ttlSeconds);
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  async del(key: string): Promise<void> {
    const hashedKey = this.stableHash(key);
    try {
      const keys = await redis.keys(hashedKey);
      if (keys.length) {
        await redis.del(keys);
      }
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }
}

export const cacheService = new CacheService();
