import { staffQueryParams, type StaffQueryParamsTypes } from '@repo/contracts/schemas/staff/staffQueryParams';

export type TableRowType = StaffQueryParamsTypes['TableRowType'];

export type TableRowKeys = StaffQueryParamsTypes['TableRowKeys'];

export const columnFiltersKeys = staffQueryParams.filterableFields;

export const sortableColumnKeys = staffQueryParams.sortableFields;

export const queryParamsSchema = staffQueryParams.schema;

export const defaultQuery = staffQueryParams.defaultQuery;

export type RequiredTableQueryParams = StaffQueryParamsTypes['Query'];
