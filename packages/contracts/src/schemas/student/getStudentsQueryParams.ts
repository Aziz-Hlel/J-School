import z from 'zod';
import type { Prettify } from '../../utils/Prettify';
import { baseQueryParamsSchema } from '../helper/queryParams';
import type { StudentWithClassroomResponse } from './studentWithClassroomResponse';

type TableRowType = StudentWithClassroomResponse;
type TableRowKeys = Prettify<
  | keyof Omit<TableRowType, 'firstName' | 'lastName' | 'classroom'>
  | `firstName.${keyof StudentWithClassroomResponse['firstName']}`
  | `lastName.${keyof StudentWithClassroomResponse['lastName']}`
  | `classroom.${keyof StudentWithClassroomResponse['classroom']}`
>;

const sortableFields = ['createdAt', 'updatedAt'] as const satisfies TableRowKeys[];
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
