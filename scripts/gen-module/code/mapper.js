export const mapperCode = ({ moduleName }) => {
  return `import type { ${moduleName.upper}Response } from '@repo/contracts/schemas/${moduleName.lower}/${moduleName.lower}Response';
import type { ${moduleName.upper} } from "@repo/db/prisma/client";

export class ${moduleName.upper}Mapper {
  static toResponse(input: ${moduleName.upper}): ${moduleName.upper}Response {
    throw new Error('Method not implemented.');
  }
}
    `;
};
