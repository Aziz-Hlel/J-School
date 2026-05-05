export const moduleCode = ({ moduleName }) => {
  return `import { ${moduleName.upper}Controller } from './${moduleName.lower}.controller';
import { createRouter } from './${moduleName.lower}.route';
import { ${moduleName.upper}Service } from './${moduleName.lower}.service';
import { ${moduleName.upper}Repo } from './${moduleName.lower}.repo';

export const ${moduleName.upper}Module = () => {
    const repo = new ${moduleName.upper}Repo();
    const service = new ${moduleName.upper}Service(repo);
    const controller = new ${moduleName.upper}Controller(service);
    const ${moduleName.lower}Router = createRouter(controller);
    return {
        ${moduleName.lower}Router,
    };
}
`;
};
