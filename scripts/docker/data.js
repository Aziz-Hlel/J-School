import { execSync } from 'child_process';
import { join } from 'path';

const ROOT = execSync('git rev-parse --show-toplevel').toString().trim();
export const PATHS = {
  ROOT,
  DOCKER_ROOT: join(ROOT, 'docker'),
  ENV_LOCAL: join(ROOT, '.env.local'),
  ENV_ROOT: join(ROOT, '.env'),
};

export const ENVS_DATA = {
  local: {
    arg: 'local',
    composeFile: 'compose.local.yml',
    envFile: '.env.local',
  },
  dev: {
    arg: 'dev',
    composeFile: 'compose.dev.yml',
    envFile: '.env.dev',
  },
  stage: {
    arg: 'stage',
    composeFile: 'compose.stage.yml',
    envFile: '.env.stage',
  },
  prod: {
    arg: 'prod',
    composeFile: 'compose.prod.yml',
    envFile: '.env.prod',
  },
};

export const ENVS_ARGS = Object.keys(ENVS_DATA);
