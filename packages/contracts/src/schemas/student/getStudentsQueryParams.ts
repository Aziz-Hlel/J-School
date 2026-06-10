import { Gender, StudentStatus } from '@repo/db/prisma/enums';
import z from 'zod';
import type { Prettify } from '../../utils/Prettify';
import { baseQueryParamsSchema, csvEnumArray } from '../helper/queryParams';
import type { StudentWithClassroomResponse } from './studentWithClassroomResponse';

type TableRowType = StudentWithClassroomResponse;
type TableRowKeys = Prettify<
  | keyof Omit<TableRowType, 'firstName' | 'lastName' | 'classroom'>
  | `firstName.${keyof StudentWithClassroomResponse['firstName']}`
  | `lastName.${keyof StudentWithClassroomResponse['lastName']}`
  | `classroom.${keyof StudentWithClassroomResponse['classroom']}`
>;

const sortableFieldsFromKeys = ['status', 'createdAt', 'updatedAt'] as const satisfies TableRowKeys[];
const sortableCustomFields = ['english_name', 'arabic_name', 'grade'] as const;
const sortableFields = [...sortableFieldsFromKeys, ...sortableCustomFields] as const;
const filterableFields = ['gender', 'status'] as const satisfies TableRowKeys[];

const schema = z.object({
  ...baseQueryParamsSchema.shape,
  sortBy: z.enum(sortableFields).catch('createdAt'),
  status: csvEnumArray(Object.values(StudentStatus)).catch([]),
  gender: csvEnumArray(Object.values(Gender)).catch([]),
});

type QueryType = z.infer<typeof schema>;

const defaultQuery = {
  page: 1,
  size: 10,
  sortBy: 'createdAt',
  order: 'desc',
  search: undefined,
  status: [],
  gender: [],
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
