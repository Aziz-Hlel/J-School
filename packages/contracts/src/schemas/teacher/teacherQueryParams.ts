import z from 'zod';
import { baseQueryParamsSchema, csvEnumArray } from '../helper/queryParams';
import type { TeacherResponse } from './teacherResponse';
import { Gender } from '../../types/enums/enums';

type TableRowType = TeacherResponse;
type TableRowKeys = keyof TableRowType;

const sortableFields = ['firstName', 'lastName', 'email', 'gender', 'createdAt'] as const satisfies TableRowKeys[];
const filterableFields = ['gender'] as const satisfies TableRowKeys[];

const schema = z.object({
  ...baseQueryParamsSchema.shape,
  sortBy: z.enum(sortableFields).catch('firstName'),
  gender: csvEnumArray(Object.values(Gender)).catch([]),
});

type QueryType = z.infer<typeof schema>;

const defaultQuery = {
  page: 1,
  size: 10,
  sortBy: 'firstName',
  order: 'desc',
  gender: [],
  search: undefined,
} as const satisfies QueryType;

export const teacherQueryParams = {
  schema,
  defaultQuery,
  sortableFields,
  filterableFields,
};

export type TeacherQueryParamsTypes = {
  Query: QueryType;
  SortableFields: (typeof teacherQueryParams.sortableFields)[number];
  FilterableFields: (typeof teacherQueryParams.filterableFields)[number];
};
