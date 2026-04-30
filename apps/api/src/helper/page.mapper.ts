import { BaseQueryParams } from '@repo/contracts/schemas/helper/queryParams';
import { Page } from '@repo/contracts/schemas/page/Page';

export class PageMapper {
  static toPage<T>(params: { data: T[]; totalElements: number; pagination: BaseQueryParams }): Page<T> {
    const { data, totalElements, pagination } = params;
    const totalPages = Math.ceil(totalElements / pagination.size);
    const offset = (pagination.page - 1) * pagination.size;
    const pageSize = data.length;
    return {
      data,
      pagination: {
        number: pagination.page,
        size: pagination.size,
        totalElements,
        totalPages,
        offset,
        pageSize,
      },
    };
  }
}
