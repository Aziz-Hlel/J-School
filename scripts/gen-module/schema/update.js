export const updateSchema = ({ moduleName }) => {
  return `import z from 'zod';
export const update${moduleName.upper}ReqSchema = z.object({
    //TODO: define schema
});

export type Update${moduleName.upper}Req = z.infer<typeof update${moduleName.upper}ReqSchema>;
`;
};
