import z from 'zod';
import { baseQueryParamsSchema, csvEnumArray } from '../helper/queryParams';
import { Gender } from '../../types/enums/enums';
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

export const parentsQueryParams = {
  schema,
  defaultQuery,
  sortableFields,
  filterableFields,
};

export type ParentsQueryParamsTypes = {
  Query: QueryType;
  TableRowType: TableRowType;
  TableRowKeys: TableRowKeys;
  SortableFields: (typeof parentsQueryParams.sortableFields)[number];
  FilterableFields: (typeof parentsQueryParams.filterableFields)[number];
};
