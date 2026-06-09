import {
  classroomsQueryParams,
  type ClassroomsQueryParamsTypes,
} from '@repo/contracts/schemas/classroom/getClassroomsQueryParams';

export type TableRowType = ClassroomsQueryParamsTypes['TableRow'];

export type TableRowKeys = ClassroomsQueryParamsTypes['TableRowKeys'];

export const columnFiltersKeys = classroomsQueryParams.filterableFields;

export const sortableColumnKeys = classroomsQueryParams.sortableFields;

export const queryParamsSchema = classroomsQueryParams.schema;

export const defaultQuery = classroomsQueryParams.defaultQuery;

export type RequiredTableQueryParams = ClassroomsQueryParamsTypes['Query'];
