import {
  myCommentsQueryParams,
  type MyCommentsQueryParamsTypes,
} from '@repo/contracts/schemas/teacher/commentsQueryParams';

export type TableRowType = MyCommentsQueryParamsTypes['TableRowType'];

export type TableRowKeys = MyCommentsQueryParamsTypes['TableRowKeys'];

export const columnFiltersKeys = myCommentsQueryParams.filterableFields;

export const sortableColumnKeys = myCommentsQueryParams.sortableFields;

export const queryParamsSchema = myCommentsQueryParams.schema;

export const defaultQuery = myCommentsQueryParams.defaultQuery;

export type RequiredTableQueryParams = MyCommentsQueryParamsTypes['Query'];
