import type { Page } from '@repo/contracts/types/page/Page';
import { apiService } from '../apiService';
import type { ProductRowResponse } from '@repo/contracts/schemas/product/productRowResponse';
import apiRoutes from '../routes/routes';
import type { CreateProductRequest } from '@repo/contracts/schemas/product/createProductRequest';

const productService = {
  getProducts: async (searchParams: { [k: string]: string | number | Array<string> }) =>
    apiService.getThrowable<Page<ProductRowResponse>>(apiRoutes.products.getProducts(), {
      params: searchParams,
    }),

  createProduct: async (payload: CreateProductRequest) =>
    apiService.postThrowable<ProductRowResponse>(apiRoutes.products.createProduct(), payload),

  updateProduct: async ({ id, payload }: { id: string; payload: CreateProductRequest }) =>
    apiService.putThrowable<ProductRowResponse>(apiRoutes.products.updateProduct(id), payload),

  deleteProduct: async (id: string) => apiService.deleteThrowable<void>(apiRoutes.products.deleteProduct(id)),
};

export default productService;
