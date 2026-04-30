import dotenv from 'dotenv';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { ENVS_ARGS, ENVS_DATA, PATHS } from './data.js';

export class EnvArgData {
  #PATHS;
  #ENVS_DATA;
  #ENV_ARGS;
  static ROOT = PATHS.ROOT;
  static DOCKER_ROOT = PATHS.DOCKER_ROOT;
  static ENV_LOCAL = PATHS.ENV_LOCAL;
  static ENV_ROOT = PATHS.ENV_ROOT;

  constructor(envArg) {
    this.#PATHS = PATHS;
    this.#ENVS_DATA = ENVS_DATA;
    this.#ENV_ARGS = ENVS_ARGS;
    this._validateEnv(envArg);
    this.envData = this.#ENVS_DATA[envArg];
  }

  _validateEnv = (envArg) => {
    if (!envArg) {
      console.error('Please provide an environment argument. Usage: node docker-up.js <env>');
      console.error(`Available environments: ${this.#ENV_ARGS.join(', ')}`);
      process.exit(1);
    }

    if (!this.#ENV_ARGS.includes(envArg)) {
      console.error(`Invalid environment: ${envArg}`);
      console.error(`Available environments: ${this.#ENV_ARGS.join(', ')}`);
      process.exit(1);
    }
  };

  loadEnv = (path) => {
    if (!existsSync(path)) return {};
    return dotenv.parse(readFileSync(path));
  };

  /**
   * @returns {string}
   */
  get envFilePath() {
    return join(this.#PATHS.ROOT, 'config', this.envData.envFile);
  }

  /**
   * @returns {string}
   */
  get composeFilePath() {
    return join(this.#PATHS.DOCKER_ROOT, this.envData.composeFile);
  }

  /**
   * @returns {object}
   */
  get envObject() {
    return {
      ...process.env,
      ...this.loadEnv(this.envFilePath),
      ...this.loadEnv(this.#PATHS.ENV_LOCAL),
      ...this.loadEnv(this.#PATHS.ENV_ROOT),
      PROJECT_ROOT: this.#PATHS.ROOT,
    };
  }

  /**
   * @returns {string[]}
   */
  get envArgs() {
    return this.#ENV_ARGS;
  }
}
