import { execSync } from 'child_process';
import z from 'zod';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { createSchema } from './schema/create.js';
import { updateSchema } from './schema/update.js';
import { responseSchema } from './schema/response.js';
import { repoCode } from './code/repo.js';
import { serviceCode } from './code/service.js';
import { controllerCode } from './code/controller.js';
import { routeCode } from './code/route.js';
import { moduleCode } from './code/module.js';

const ROOT = execSync('git rev-parse --show-toplevel').toString().trim();

const ModuleNameSchema = z
  .string()
  .trim()
  .min(2, 'Module name must be at least 2 characters')
  .max(20, 'Module name must be less than 20 characters')
  .regex(/^[A-Za-z_0-9]+$/, 'Module name must contain only letters, numbers and underscores');

const moduleNameResult = ModuleNameSchema.safeParse(process.argv[2]);

if (!moduleNameResult.success) {
  console.error('Invalid module name');
  console.error(moduleNameResult.error);
  process.exit(1);
}

const validInput = moduleNameResult.data;

const moduleName = {
  lower: validInput.charAt(0).toLowerCase() + validInput.slice(1),
  upper: validInput.charAt(0).toUpperCase() + validInput.slice(1),
};

// check if module already exists

const modulePath = `${ROOT}/apps/api/src/modules/${moduleName.upper}`;

if (existsSync(modulePath)) {
  console.error(`Module "${moduleName.upper}" already exists at "${modulePath}"`);
  process.exit(1);
}

// create module directory
mkdirSync(modulePath, { recursive: true });

// create module files
writeFileSync(`${modulePath}/${moduleName.lower}.repo.ts`, repoCode({ moduleName }));
writeFileSync(`${modulePath}/${moduleName.lower}.service.ts`, serviceCode({ moduleName }));
writeFileSync(`${modulePath}/${moduleName.lower}.controller.ts`, controllerCode({ moduleName }));
writeFileSync(`${modulePath}/${moduleName.lower}.route.ts`, routeCode({ moduleName }));
writeFileSync(`${modulePath}/${moduleName.lower}.module.ts`, moduleCode({ moduleName }));

// check if schema folder already exists
const schemaPath = `${ROOT}/packages/contracts/src/schemas/${moduleName.upper}`;

if (existsSync(schemaPath)) {
  console.error(`Module "${moduleName.upper}" already exists at "${schemaPath}"`);
  process.exit(1);
}

mkdirSync(schemaPath, { recursive: true });

// create module schema files
writeFileSync(`${schemaPath}/create.ts`, createSchema({ moduleName }));
writeFileSync(`${schemaPath}/update.ts`, updateSchema({ moduleName }));
writeFileSync(`${schemaPath}/response.ts`, responseSchema({ moduleName }));
