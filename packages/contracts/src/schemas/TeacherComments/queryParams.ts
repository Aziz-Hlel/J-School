import z from 'zod';
import { baseQueryParamsSchema } from '../helper/queryParams';
import type { TeacherCommentsResponse } from './response';

type TableRowType = TeacherCommentsResponse;
type TableRowKeys = keyof TableRowType;

const sortableFields = ['createdAt', 'updatedAt'] as const satisfies TableRowKeys[];
const filterableFields = [] as const satisfies TableRowKeys[];

const schema = z
  .object({
    ...baseQueryParamsSchema.shape,
    sortBy: z.enum(sortableFields).catch('createdAt'),
    teacherId: z.uuid().optional().catch(undefined),
  })
  .omit({ search: true });

type QueryType = z.infer<typeof schema>;

const defaultQuery = {
  page: 1,
  size: 10,
  sortBy: 'createdAt',
  order: 'desc',
} as const satisfies QueryType;

export const teacherCommentsQueryParams = {
  schema,
  defaultQuery,
  sortableFields,
  filterableFields,
};

export type TeacherCommentsQueryParamsTypes = {
  Query: QueryType;
  TableRowType: TableRowType;
  TableRowKeys: TableRowKeys;
  SortableFields: (typeof teacherCommentsQueryParams.sortableFields)[number];
  FilterableFields: (typeof teacherCommentsQueryParams.filterableFields)[number];
};
