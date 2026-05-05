export const responseSchema = ({ moduleName }) => {
  return `import z from 'zod';
export const ${moduleName.lower}ResponseSchema = z.object({
    //TODO: define schema
});

export type ${moduleName.upper}Response = z.infer<typeof ${moduleName.lower}ResponseSchema>;
    `;
};
