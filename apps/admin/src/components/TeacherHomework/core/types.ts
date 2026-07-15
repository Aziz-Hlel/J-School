import {
  teacherHomeworkQueryParams,
  type TeacherHomeworkQueryParamsTypes,
} from '@repo/contracts/schemas/teacher/homeworQueryParams';

export type TableRowType = TeacherHomeworkQueryParamsTypes['TableRowType'];

export type TableRowKeys = TeacherHomeworkQueryParamsTypes['TableRowKeys'];

export const columnFiltersKeys = teacherHomeworkQueryParams.filterableFields;

export const sortableColumnKeys = teacherHomeworkQueryParams.sortableFields;

export const queryParamsSchema = teacherHomeworkQueryParams.schema;

export const defaultQuery = teacherHomeworkQueryParams.defaultQuery;

export type RequiredTableQueryParams = TeacherHomeworkQueryParamsTypes['Query'];
