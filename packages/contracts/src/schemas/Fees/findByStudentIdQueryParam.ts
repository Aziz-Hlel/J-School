import z from 'zod';
import { baseQueryParamsSchema, csvEnumArray } from '../helper/queryParams';
import type { FeesResponse } from './response';
import { FeeItemStatus } from '../../types/enums/enums';

type TableRowType = FeesResponse;
type TableRowKeys = keyof TableRowType;

const sortableFields = ['startDate'] as const satisfies TableRowKeys[];
const filterableFields = ['status'] as const satisfies TableRowKeys[];

const schema = z
  .object({
    ...baseQueryParamsSchema.shape,
    sortBy: z.enum(sortableFields).catch('startDate'),
    status: csvEnumArray(Object.values(FeeItemStatus)).catch([]),
  })
  .omit({ search: true });

type QueryType = z.infer<typeof schema>;

const defaultQuery = {
  page: 1,
  size: 10,
  sortBy: 'startDate',
  order: 'desc',
  status: [],
} as const satisfies QueryType;

export const feesQueryParams = {
  schema,
  defaultQuery,
  sortableFields,
  filterableFields,
};

export type FeesQueryParamsTypes = {
  Query: QueryType;
  SortableFields: (typeof feesQueryParams.sortableFields)[number];
  FilterableFields: (typeof feesQueryParams.filterableFields)[number];
};
