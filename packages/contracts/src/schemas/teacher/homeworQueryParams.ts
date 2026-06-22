import z from 'zod';
import { baseQueryParamsSchema } from '../helper/queryParams';
import type { HomeworkResponse } from '../Homework/response';

type TableRowType = HomeworkResponse;
type TableRowKeys = keyof TableRowType;

const sortableFields = ['due'] as const satisfies TableRowKeys[];
const filterableFields = [] as const satisfies TableRowKeys[];

const schema = z
  .object({
    ...baseQueryParamsSchema.shape,
    sortBy: z.enum(sortableFields).catch('due'),
    classroomId: z.uuid().optional().catch(undefined),
    studentId: z.uuid().optional().catch(undefined),
  })
  .omit({ search: true });

type QueryType = z.infer<typeof schema>;

const defaultQuery = {
  page: 1,
  size: 10,
  sortBy: 'due',
  order: 'desc',
  classroomId: undefined,
  studentId: undefined,
} as const satisfies QueryType;

export const teacherHomeworkQueryParams = {
  schema,
  defaultQuery,
  sortableFields,
  filterableFields,
};

export type TeacherHomeworkQueryParamsTypes = {
  Query: QueryType;
  SortableFields: (typeof teacherHomeworkQueryParams.sortableFields)[number];
  FilterableFields: (typeof teacherHomeworkQueryParams.filterableFields)[number];
};
