import z from 'zod';
import { Gender } from '../../types/enums/enums';
import { baseQueryParamsSchema, csvEnumArray } from '../helper/queryParams';
import type { ParentResponse } from './parentResponse';

type TableRowType = ParentResponse;
type TableRowKeys = keyof TableRowType;

const sortableFields = ['firstName', 'lastName', 'createdAt'] as const satisfies TableRowKeys[];
const filterableFields = ['gender'] as const satisfies TableRowKeys[];

const schema = z.object({
  ...baseQueryParamsSchema.shape,
  sortBy: z.enum(sortableFields).catch('createdAt'),
  gender: csvEnumArray(Object.values(Gender)).catch([]),
});

type QueryType = z.infer<typeof schema>;

const defaultQuery = {
  page: 1,
  size: 10,
  sortBy: 'createdAt',
  order: 'desc',
  gender: [],
  search: undefined,
} as const satisfies QueryType;

export const parentQueryParams = {
  schema,
  defaultQuery,
  sortableFields,
  filterableFields,
};

export type ParentQueryParamsTypes = {
  Query: QueryType;
  SortableFields: (typeof parentQueryParams.sortableFields)[number];
  FilterableFields: (typeof parentQueryParams.filterableFields)[number];
};
