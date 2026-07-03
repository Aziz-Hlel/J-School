import { teacherQueryParams, type TeacherQueryParamsTypes } from '@repo/contracts/schemas/teacher/teacherQueryParams';

export type TableRowType = TeacherQueryParamsTypes['TableRow'];

export type TableRowKeys = TeacherQueryParamsTypes['TableKeys'];

export const columnFiltersKeys = teacherQueryParams.filterableFields;

export const sortableColumnKeys = teacherQueryParams.sortableFields;

export const queryParamsSchema = teacherQueryParams.schema;

export const defaultQuery = teacherQueryParams.defaultQuery;

export type RequiredTableQueryParams = TeacherQueryParamsTypes['Query'];
