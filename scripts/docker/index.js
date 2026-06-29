#!/usr/bin/env node
import { execSync, spawnSync } from 'child_process';
import { EnvArgData } from './envArgData.js';

class dockerUP {
  static #GREEN = '\x1b[32m';
  static #YELLOW = '\x1b[33m';
  static #NC = '\x1b[0m';
  #DOCKER_DATA;

  constructor(envArg) {
    this.#DOCKER_DATA = new EnvArgData(envArg);
  }

  isV2 = (() => {
    try {
      execSync('docker compose version', { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  })();

  run() {
    const command = this.isV2 ? 'docker' : 'docker-compose';

    const composeFilePath = this.#DOCKER_DATA.composeFilePath;
    const envObject = this.#DOCKER_DATA.envObject;
    const args = [...(this.isV2 ? ['compose'] : []), '-f', composeFilePath, 'up', '--build'];

    spawnSync(command, args, { stdio: 'inherit', env: envObject });

    console.log(`${dockerUP.#GREEN}✅ Done!${dockerUP.#NC}`);
  }
}

const envArg = process.argv[2];
new dockerUP(envArg).run();
