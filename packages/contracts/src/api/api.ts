// import { createProductRequestSchema } from '../schemas/product/createProductRequest';
// import { productResponseSchema } from '../schemas/product/productResponse';
// import { updateProductRequestSchema } from '../schemas/product/updateProductRequest';

const createProductRequestSchema = '';
const productResponseSchema = '';
const updateProductRequestSchema = '';

const routeVersion = 'v1';

const routeName = 'products';

const userRoutes = {
  route: routeName,
  version: routeVersion,
  create: {
    name: 'create',
    method: 'POST',
    paths: {
      absolute: () => `/${routeVersion}/${routeName}` as const,
      relative: () => `/${routeName}` as const,
    },
    schema: {
      request: {
        body: createProductRequestSchema,
      },
      response: {
        201: productResponseSchema,
      },
    },
  },
  update: {
    name: 'update',
    method: 'PUT',
    paths: {
      absolute: ({ id }: { id: string }) => `/${routeVersion}/${routeName}/${id}` as const,
      relative: ({ id }: { id: string }) => `/${routeName}/${id}` as const,
    },
    schema: {
      request: {
        body: updateProductRequestSchema,
      },
      response: {
        200: productResponseSchema,
      },
    },
  },
} as const;

export default userRoutes;

userRoutes.create.method;
