export const updateSchema = ({ moduleName }) => {
  return `import z from 'zod';
export const ${moduleName.lower}UpdateDto = z.object({
    //TODO: define schema
});

export type ${moduleName.upper}UpdateInput = z.infer<typeof ${moduleName.lower}UpdateDto>;
`;
};
