import {
  adminHomeworkQueryParams,
  type AdminHomeworkQueryParamsTypes,
} from '@repo/contracts/schemas/Homework/adminQueryParam';

export type TableRowType = AdminHomeworkQueryParamsTypes['TableRowType'];

export type TableRowKeys = AdminHomeworkQueryParamsTypes['TableRowKeys'];

export const columnFiltersKeys = adminHomeworkQueryParams.filterableFields;

export const sortableColumnKeys = adminHomeworkQueryParams.sortableFields;

export const queryParamsSchema = adminHomeworkQueryParams.schema;

export const defaultQuery = adminHomeworkQueryParams.defaultQuery;

export type RequiredTableQueryParams = AdminHomeworkQueryParamsTypes['Query'];
