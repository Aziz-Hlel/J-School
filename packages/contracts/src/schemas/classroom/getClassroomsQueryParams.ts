import z from 'zod';
import type { ClassroomResponse } from './classResponse';
import { baseQueryParamsSchema, csvEnumArray } from '../helper/queryParams';
import { ClassGrade } from '../../types/enums/enums';

type TableRowType = ClassroomResponse;
type TableRowKeys = keyof TableRowType;

const sortableFields = ['name', 'grade', 'createdAt', 'updatedAt'] as const satisfies TableRowKeys[];
const filterableFields = ['grade'] as const satisfies TableRowKeys[];

const schema = z.object({
  ...baseQueryParamsSchema.shape,
  sortBy: z.enum(sortableFields).catch('grade'),
  grade: csvEnumArray(Object.values(ClassGrade)).catch([]),
});

type QueryType = z.infer<typeof schema>;

const defaultQuery = {
  page: 1,
  size: 10,
  sortBy: 'grade',
  order: 'desc',
  grade: [],
  search: undefined,
} as const satisfies QueryType;

export const classroomsQueryParams = {
  schema,
  defaultQuery,
  sortableFields,
  filterableFields,
};

export type ClassroomsQueryParamsTypes = {
  Query: QueryType;
  SortableFields: (typeof classroomsQueryParams.sortableFields)[number];
  FilterableFields: (typeof classroomsQueryParams.filterableFields)[number];
};
