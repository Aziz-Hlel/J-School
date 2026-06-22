import z from 'zod';
import { baseQueryParamsSchema } from '../helper/queryParams';
import type { TeacherCommentsResponse } from '../TeacherComments/response';

type TableRowType = TeacherCommentsResponse;
type TableRowKeys = keyof TableRowType;

const sortableFields = ['createdAt', 'updatedAt'] as const satisfies TableRowKeys[];
const filterableFields = [] as const satisfies TableRowKeys[];

const schema = z
  .object({
    ...baseQueryParamsSchema.shape,
    sortBy: z.enum(sortableFields).catch('createdAt'),
    studentId: z.uuid().optional().catch(undefined),
  })
  .omit({ search: true });

type QueryType = z.infer<typeof schema>;

const defaultQuery = {
  page: 1,
  size: 10,
  sortBy: 'createdAt',
  order: 'desc',
} as const satisfies QueryType;

export const myCommentsQueryParams = {
  schema,
  defaultQuery,
  sortableFields,
  filterableFields,
};

export type MyCommentsQueryParamsTypes = {
  Query: QueryType;
  SortableFields: (typeof myCommentsQueryParams.sortableFields)[number];
  FilterableFields: (typeof myCommentsQueryParams.filterableFields)[number];
};
