export const createSchema = ({ moduleName }) => {
  return `import z from 'zod';
export const create${moduleName.upper}ReqSchema = z.object({
    //TODO: define schema
});

export type Create${moduleName.upper}Req = z.infer<typeof create${moduleName.upper}ReqSchema>;

`;
};
