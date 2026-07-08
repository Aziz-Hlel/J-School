import z from 'zod';
import { ClassGrade } from '../../types/enums/enums';
import { baseQueryParamsSchema, csvEnumArray } from '../helper/queryParams';
import type { ExtraCurricularResponse } from './extraCurricularResponse';

type TableRowType = ExtraCurricularResponse;
type TableRowKeys = keyof TableRowType;

const sortableFields = ['createdAt'] as const satisfies TableRowKeys[];
const filterableFields = ['title'] as const satisfies TableRowKeys[];

const schema = z.object({
  ...baseQueryParamsSchema.shape,
  sortBy: z.enum(sortableFields).catch('createdAt'),
  grade: csvEnumArray(Object.values(ClassGrade)).catch([]),
});

type QueryType = z.infer<typeof schema>;

const defaultQuery = {
  page: 1,
  size: 10,
  sortBy: 'createdAt',
  order: 'desc',
  grade: [],
  search: undefined,
} as const satisfies QueryType;

export const extraCurricularQueryParams = {
  schema,
  defaultQuery,
  sortableFields,
  filterableFields,
};

export type ExtraCurricularQueryParamsTypes = {
  Query: QueryType;
  TableRowType: TableRowType;
  TableRowKeys: TableRowKeys;
  SortableFields: (typeof extraCurricularQueryParams.sortableFields)[number];
  FilterableFields: (typeof extraCurricularQueryParams.filterableFields)[number];
};
