import z from 'zod';
import { baseQueryParamsSchema, csvEnumArray } from '../helper/queryParams';
import { Gender } from '../../types/enums/enums';
import type { StaffResponse } from './staffResponse';

type TableRowType = StaffResponse;
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

export const staffQueryParams = {
  schema,
  defaultQuery,
  sortableFields,
  filterableFields,
};

export type StaffQueryParamsTypes = {
  Query: QueryType;
  SortableFields: (typeof staffQueryParams.sortableFields)[number];
  FilterableFields: (typeof staffQueryParams.filterableFields)[number];
};
