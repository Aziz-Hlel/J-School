export const routeCode = ({ moduleName }) => {
  return `import { Router } from 'express';
import { ${moduleName.upper}Controller } from './${moduleName.lower}.controller';
import { asyncHandler } from '@/core/async-handler';
import { requireAuth } from '@/middleware/requireAuth.middleware';

export const createRouter = (controller: ${moduleName.upper}Controller) => {
    const router = Router({ mergeParams: true });
    router.post('/',requireAuth,asyncHandler(controller.create));
    router.put('/:${moduleName.lower}Id',requireAuth,asyncHandler(controller.update));
    router.delete('/:${moduleName.lower}Id',requireAuth,asyncHandler(controller.delete));
    router.get('/:${moduleName.lower}Id',requireAuth,asyncHandler(controller.findById));
    return router;
}
`;
};
