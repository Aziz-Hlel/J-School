import z from 'zod';
import { baseQueryParamsSchema } from '../helper/queryParams';
import type { StudentResponse } from './studentResponse';

type TableRowType = StudentResponse;
type TableRowKeys =
  | Omit<keyof TableRowType, 'firstName' | 'lastName'>
  | `firstName.${keyof StudentResponse['firstName']}`
  | `lastName.${keyof StudentResponse['lastName']}`;

const sortableFields = ['firstName', 'lastName', 'createdAt', 'updatedAt'] as const satisfies TableRowKeys[];
const filterableFields = ['gender'] as const satisfies TableRowKeys[];

const schema = z.object({
  ...baseQueryParamsSchema.shape,
  sortBy: z.enum(sortableFields).catch('createdAt'),
});

type QueryType = z.infer<typeof schema>;

const defaultQuery = {
  page: 1,
  size: 10,
  sortBy: 'createdAt',
  order: 'desc',
  search: undefined,
} as const satisfies QueryType;

export const studentsQueryParams = {
  schema,
  defaultQuery,
  sortableFields,
  filterableFields,
};

export type StudentsQueryParamsTypes = {
  TableRow: TableRowType;
  TableKeys: TableRowKeys;
  Query: QueryType;
  SortableFields: (typeof studentsQueryParams.sortableFields)[number];
  FilterableFields: (typeof studentsQueryParams.filterableFields)[number];
};
