import {
  extraCurricularQueryParams,
  type ExtraCurricularQueryParamsTypes,
} from '@repo/contracts/schemas/extraCurricular/findAllQueryParams';

export type TableRowType = ExtraCurricularQueryParamsTypes['TableRowType'];

export type TableRowKeys = ExtraCurricularQueryParamsTypes['TableRowKeys'];

export const columnFiltersKeys = extraCurricularQueryParams.filterableFields;

export const sortableColumnKeys = extraCurricularQueryParams.sortableFields;

export const queryParamsSchema = extraCurricularQueryParams.schema;

export const defaultQuery = extraCurricularQueryParams.defaultQuery;

export type RequiredTableQueryParams = ExtraCurricularQueryParamsTypes['Query'];
