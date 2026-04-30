import ENV from '../config/env';
import envSeeds from './seedPerEnv';

const seed = async () => {
  const seeds = envSeeds[ENV.NODE_ENV];

  try {
    await Promise.all(seeds.map((seed) => seed()));
  } catch (error) {
    console.error('❌ ERROR : Seeding failed.', error);
    throw error;
  }
  console.log('✅ SUCCESS : Seeding completed.');
};

export default seed;
