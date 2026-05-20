import z from 'zod';
import { baseQueryParamsSchema } from '../helper/queryParams';
import type { HomeworkResponse } from './response';

type TableRowType = HomeworkResponse;
type TableRowKeys = keyof TableRowType;

const sortableFields = ['due'] as const satisfies TableRowKeys[];
const filterableFields = [] as const satisfies TableRowKeys[];

const schema = z
  .object({
    ...baseQueryParamsSchema.shape,
    sortBy: z.enum(sortableFields).catch('due'),
  })
  .omit({ search: true });

type QueryType = z.infer<typeof schema>;

const defaultQuery = {
  page: 1,
  size: 10,
  sortBy: 'due',
  order: 'desc',
} as const satisfies QueryType;

export const homeworkQueryParams = {
  schema,
  defaultQuery,
  sortableFields,
  filterableFields,
};

export type HomeworkQueryParamsTypes = {
  Query: QueryType;
  SortableFields: (typeof homeworkQueryParams.sortableFields)[number];
  FilterableFields: (typeof homeworkQueryParams.filterableFields)[number];
};
