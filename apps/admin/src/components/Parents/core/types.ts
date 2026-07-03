import { parentsQueryParams, type ParentsQueryParamsTypes } from '@repo/contracts/schemas/parent/queryParams';

export type TableRowType = ParentsQueryParamsTypes['TableRowType'];

export type TableRowKeys = ParentsQueryParamsTypes['TableRowKeys'];

export const columnFiltersKeys = parentsQueryParams.filterableFields;

export const sortableColumnKeys = parentsQueryParams.sortableFields;

export const queryParamsSchema = parentsQueryParams.schema;

export const defaultQuery = parentsQueryParams.defaultQuery;

export type RequiredTableQueryParams = ParentsQueryParamsTypes['Query'];
