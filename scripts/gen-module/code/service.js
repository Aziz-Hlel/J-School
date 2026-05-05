export const serviceCode = ({ moduleName }) => {
  return `import type { ${moduleName.upper}Repo } from './${moduleName.lower}.repo';
export class ${moduleName.upper}Service {
  constructor(private readonly repo: ${moduleName.upper}Repo){}
  create = async() => {}
  update = async() => {}
  delete = async() => {}
  find = async() => {}
}
`;
};
