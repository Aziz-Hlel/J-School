import { initCacheEnv } from '@repo/env/cache';
import Redis from 'ioredis';

// const redis = new Redis({
//   host: cacheEnv.REDIS_HOST,
//   port: cacheEnv.REDIS_PORT,
//   password: cacheEnv.REDIS_PASSWORD,
//   lazyConnect: true,
//   maxRetriesPerRequest: 3,
//   enableReadyCheck: true,
// });

// export async function connectRedis() {
//   if (redis.status === 'ready') return;
//   if (redis.status === 'connecting') return;
//   if (redis.status === 'connect') return;

//   try {
//     await redis.connect();
//     console.log('✅ SUCCESS : Redis connected successfully.');
//   } catch (err) {
//     console.error('❌ ERROR : Redis connection failed', err);
//     process.exit(1);
//   }
// }
// export default redis;

// redis.on('error', (err) => {
//   console.error('❌ ERROR : Redis error', err);
// });

// redis.on('warning', (warning) => {
//   console.warn('⚠️ WARNING : Redis warning', warning);
// });

const cacheEnv = initCacheEnv();

let redis: Redis;

const getRedisClient = async () => {
  if (redis) return redis;

  redis = new Redis({
    host: cacheEnv.REDIS_HOST,
    port: cacheEnv.REDIS_PORT,
    password: cacheEnv.REDIS_PASSWORD,
    lazyConnect: true,
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
  });
  try {
    await redis.connect();
    console.log('✅ SUCCESS : Redis connected successfully.');
  } catch (err) {
    console.error('❌ ERROR : Redis connection failed', err);
    process.exit(1);
  }

  redis.on('error', (err) => {
    console.error('❌ ERROR : Redis error', err);
  });

  redis.on('warning', (warning) => {
    console.warn('⚠️ WARNING : Redis warning', warning);
  });

  return redis;
};

export default getRedisClient;
