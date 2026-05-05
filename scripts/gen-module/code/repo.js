export const repoCode = ({ moduleName }) => {
  return `
import { prisma } from '@/bootstrap/db.init';
export class ${moduleName.upper}Repo {
  create = async() => {}

  update = async() => {}

  delete = async() => {}

  find = async() => {}
}
    `;
};
