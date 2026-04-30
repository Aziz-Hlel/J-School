import { Env } from '@/config/env';
import { faker } from '@faker-js/faker';

type EnvSeeds = Record<Env['NODE_ENV'], Function[] | []>;

const devSeeds = [() => {}]; //[seedDev];
const prodSeeds = [() => {}]; //[seedProdUsers];

const envSeeds: EnvSeeds = {
  dev: devSeeds,
  build: devSeeds,
  stage: prodSeeds,
  production: prodSeeds,
};

export default envSeeds;
