import z from 'zod';
import { baseQueryParamsSchema } from '../helper/queryParams';
import type { HomeworkResponse } from './response';

type TableRowType = HomeworkResponse;
type TableRowKeys = keyof TableRowType;

const sortableFields = ['due'] as const satisfies TableRowKeys[];
const filterableFields = [] as const satisfies TableRowKeys[];

const schema = z
  .object({
    ...baseQueryParamsSchema.shape,
    sortBy: z.enum(sortableFields).catch('due'),
    teacherId: z.uuid().optional().catch(undefined),
    classroomId: z.uuid().optional().catch(undefined),
  })
  .omit({ search: true });

type QueryType = z.infer<typeof schema>;

const defaultQuery = {
  page: 1,
  size: 10,
  sortBy: 'due',
  order: 'desc',
  teacherId: undefined,
  classroomId: undefined,
} as const satisfies QueryType;

export const adminHomeworkQueryParams = {
  schema,
  defaultQuery,
  sortableFields,
  filterableFields,
};

export type AdminHomeworkQueryParamsTypes = {
  TableRowType: TableRowType;
  TableRowKeys: TableRowKeys;
  Query: QueryType;
  SortableFields: (typeof adminHomeworkQueryParams.sortableFields)[number];
  FilterableFields: (typeof adminHomeworkQueryParams.filterableFields)[number];
};
