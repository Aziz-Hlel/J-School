export const controllerCode = ({ moduleName }) => {
  return `import type { Request, Response } from 'express';
import { ${moduleName.upper}Service } from './${moduleName.lower}.service';
import getUrlParam from '@/utils/getUrlParam';

export class ${moduleName.upper}Controller {
  constructor(private readonly service: ${moduleName.upper}Service){}

  create = async (req: Request, res: Response) => {}

  update = async (req: Request, res: Response) => {}

  delete = async (req: Request, res: Response) => {}

  findById = async (req: Request, res: Response) => {}
}
    `;
};
