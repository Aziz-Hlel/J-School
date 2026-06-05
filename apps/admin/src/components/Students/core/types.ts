import {
  studentsQueryParams,
  type StudentsQueryParamsTypes,
} from '@repo/contracts/schemas/student/getStudentsQueryParams';

export type TableRowType = StudentsQueryParamsTypes['TableRow'];

export type TableRowKeys = StudentsQueryParamsTypes['TableRow'];

export const columnFiltersKeys = studentsQueryParams.filterableFields;

export const sortableColumnKeys = studentsQueryParams.sortableFields;

export const queryParamsSchema = studentsQueryParams.schema;

export const defaultQuery = studentsQueryParams.defaultQuery;

export type RequiredTableQueryParams = StudentsQueryParamsTypes['Query'];
