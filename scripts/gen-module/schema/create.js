export const createSchema = ({ moduleName }) => {
  return `import z from 'zod';
export const ${moduleName.lower}CreateDto = z.object({
    //TODO: define schema
});

export type ${moduleName.upper}CreateInput = z.infer<typeof ${moduleName.lower}CreateDto>;

`;
};
