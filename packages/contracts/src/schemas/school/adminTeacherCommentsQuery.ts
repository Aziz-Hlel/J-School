import z from 'zod';
import { baseQueryParamsSchema } from '../helper/queryParams';
import type { TeacherCommentsResponse } from '../TeacherComments/response';

type TableRowType = TeacherCommentsResponse;
type TableRowKeys = keyof TableRowType;

const sortableFields = ['createdAt', 'updatedAt'] as const satisfies TableRowKeys[];
const filterableFields = ['teacherId', 'studentId'] as const;

const schema = z
  .object({
    ...baseQueryParamsSchema.shape,
    sortBy: z.enum(sortableFields).catch('createdAt'),
    teacherId: z.uuid().optional().catch(undefined),
    studentId: z.uuid().optional().catch(undefined),
  })
  .omit({ search: true });

type QueryType = z.infer<typeof schema>;

const defaultQuery = {
  page: 1,
  size: 10,
  sortBy: 'createdAt',
  order: 'desc',
  teacherId: undefined,
  studentId: undefined,
} as const satisfies QueryType;

export const adminTeacherCommentsQueryParams = {
  schema,
  defaultQuery,
  sortableFields,
  filterableFields,
};

export type AdminTeacherCommentsQueryParamsTypes = {
  Query: QueryType;
  SortableFields: (typeof adminTeacherCommentsQueryParams.sortableFields)[number];
  FilterableFields: (typeof adminTeacherCommentsQueryParams.filterableFields)[number];
};
