import {
  teacherCommentsQueryParams,
  type TeacherCommentsQueryParamsTypes,
} from '@repo/contracts/schemas/TeacherComments/queryParams';

export type TableRowType = TeacherCommentsQueryParamsTypes['TableRowType'];

export type TableRowKeys = TeacherCommentsQueryParamsTypes['TableRowKeys'];

export const columnFiltersKeys = teacherCommentsQueryParams.filterableFields;

export const sortableColumnKeys = teacherCommentsQueryParams.sortableFields;

export const queryParamsSchema = teacherCommentsQueryParams.schema;

export const defaultQuery = teacherCommentsQueryParams.defaultQuery;

export type RequiredTableQueryParams = TeacherCommentsQueryParamsTypes['Query'];
