import ENV, { EnvAll } from '.';
import { AwsStorageSchema, CorsSchema } from './envs.fields';

export const NODE_ENVS = {
  dev: 'dev',
  build: 'build',
  stage: 'stage',
  production: 'production',
} as const;

export type NodeEnvs = (typeof NODE_ENVS)[keyof typeof NODE_ENVS];

export const prodEnvs = [NODE_ENVS.stage, NODE_ENVS.production];

export const devEnvs = [NODE_ENVS.dev, NODE_ENVS.build];

export const isProdEnv = (env: typeof ENV): env is Extract<typeof ENV, { NODE_ENV: 'production' | 'stage' }> => {
  return env.NODE_ENV === 'production' || env.NODE_ENV === 'stage';
};

export const isDev = (env: typeof ENV): env is Extract<typeof env, { NODE_ENV: 'dev' | 'build' }> => {
  return env.NODE_ENV === 'dev' || env.NODE_ENV === 'build';
};

const getPayload = (
  env: typeof ENV,
  fieldName: keyof EnvAll,
): {
  fieldExist: boolean;
  isNodeEnvProd: boolean;
  isNodeEnvDev: boolean;
} => {
  const fieldExist = fieldName in env && env[fieldName as keyof typeof ENV] !== undefined;
  const isNodeEnvProd = isProdEnv(env);
  const isNodeEnvDev = isDev(env);
  return { fieldExist, isNodeEnvProd, isNodeEnvDev };
};

export const isAllowedOriginPatternsExist = (env: typeof ENV): env is CorsSchema & typeof ENV => {
  const { fieldExist, isNodeEnvProd, isNodeEnvDev } = getPayload(env, 'ALLOWED_ORIGIN_PATTERNS');
  if (fieldExist && isNodeEnvDev) {
    console.log('ℹ️  ALLOWED_ORIGIN_PATTERNS is defined in a dev env');
  }
  if (!fieldExist && isNodeEnvProd) {
    console.log('ℹ️  ALLOWED_ORIGIN_PATTERNS is not defined in a prod env');
  }
  return fieldExist;
};

// ! idk bout all this
export const isAwsStorageExists = (env: typeof ENV): env is AwsStorageSchema & typeof ENV => {
  const { fieldExist, isNodeEnvProd, isNodeEnvDev } = getPayload(env, 'AWS_REGION');
  const { fieldExist: fieldExist2 } = getPayload(env, 'AWS_ACCESS_KEY_ID');
  const { fieldExist: fieldExist3 } = getPayload(env, 'AWS_SECRET_ACCESS_KEY');
  const { fieldExist: fieldExist4 } = getPayload(env, 'AWS_S3_BUCKET');
  if (fieldExist && isNodeEnvDev) {
    console.log('ℹ️ AWS_REGION is defined in a dev env');
  }
  if (!fieldExist && isNodeEnvProd) {
    console.log('ℹ️ AWS_REGION is not defined in a prod env');
  }
  if (fieldExist2 && isNodeEnvDev) {
    console.log('ℹ️ AWS_ACCESS_KEY_ID is defined in a dev env');
  }
  if (!fieldExist2 && isNodeEnvProd) {
    console.log('ℹ️ AWS_ACCESS_KEY_ID is not defined in a prod env');
  }
  if (fieldExist3 && isNodeEnvDev) {
    console.log('ℹ️ AWS_SECRET_ACCESS_KEY is defined in a dev env');
  }
  if (!fieldExist3 && isNodeEnvProd) {
    console.log('ℹ️ AWS_SECRET_ACCESS_KEY is not defined in a prod env');
  }
  if (fieldExist4 && isNodeEnvDev) {
    console.log('ℹ️ AWS_S3_BUCKET is defined in a dev env');
  }
  if (!fieldExist4 && isNodeEnvProd) {
    console.log('ℹ️ AWS_S3_BUCKET is not defined in a prod env');
  }
  return fieldExist && fieldExist2 && fieldExist3 && fieldExist4;
};
