import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
  Updater,
  VisibilityState,
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';

import { columnFiltersKeys, defaultQuery, type RequiredTableQueryParams } from '../core/types';
import useQueryParams from './use-query-params';

const setParamIfNotDefault = (params: URLSearchParams, key: keyof RequiredTableQueryParams, value: string) => {
  const defaultValue = defaultQuery[key];
  if (String(defaultValue) !== value && value.trim().length !== 0) {
    params.set(key, value);
  } else {
    params.delete(key);
  }
};

const useTableProps = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { queryParams } = useQueryParams();

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection] = useState({});

  const globalSearch = useMemo(() => {
    return queryParams.search;
  }, [queryParams.search]);

  const setGlobalSearch = (value: string) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      setParamIfNotDefault(params, 'search', value);
      setParamIfNotDefault(params, 'page', '1');
      return params;
    });
  };

  const onSortingChange = (updater: Updater<SortingState>) => {
    const newSortingState = typeof updater === 'function' ? updater(sorting) : updater;

    const sortField = newSortingState[0]?.id ?? 'createdAt';
    const sortOrder = newSortingState[0]?.desc ? 'desc' : 'asc';

    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      setParamIfNotDefault(params, 'sortBy', sortField);
      setParamIfNotDefault(params, 'order', sortOrder);
      return params;
    });
  };

  const sorting: SortingState = [
    {
      id: queryParams.sortBy,
      desc: queryParams.order === 'desc',
    },
  ];

  const columnFilters = useMemo(() => {
    const columnFilters = [];
    for (const columnFilter of columnFiltersKeys) {
      const filterValue = queryParams[columnFilter as keyof RequiredTableQueryParams];

      const isEmptyString = typeof filterValue === 'string' && filterValue.trim() === '';
      const isEmptyArray = Array.isArray(filterValue) && filterValue.length === 0;
      const isUndefined = filterValue === undefined;
      if (isEmptyString || isEmptyArray || isUndefined) continue;
      columnFilters.push({
        id: columnFilter,
        value: filterValue,
      });
    }
    return columnFilters;
  }, [searchParams.toString()]);

  const onColumnFiltersChange = (updater: Updater<ColumnFiltersState>) => {
    const newColumnFiltersState = typeof updater === 'function' ? updater(columnFilters) : updater;
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);
        const resetFilters = newColumnFiltersState.length === 0;
        if (resetFilters) {
          for (const key of columnFiltersKeys) {
            params.delete(key);
          }
          setParamIfNotDefault(params, 'page', '1');

          return params;
        }

        for (const key of columnFiltersKeys) {
          const existsInNewFilters = newColumnFiltersState.find((filter) => filter.id === key);
          if (!existsInNewFilters) {
            params.delete(key);
            continue;
          }
          const filterHasNoValue =
            existsInNewFilters.value == null ||
            (Array.isArray(existsInNewFilters.value) && existsInNewFilters.value.length === 0) ||
            existsInNewFilters.value === '';
          if (filterHasNoValue) {
            params.delete(key);
            continue;
          }
          params.set(key, (existsInNewFilters.value as any).join(','));
        }
        setParamIfNotDefault(params, 'page', '1');
        return params;
      },
      { replace: true },
    );
  };

  const pageSize: number = useMemo(() => {
    return queryParams.size;
  }, [queryParams.size]);

  const pageNumber = useMemo(() => {
    return queryParams.page;
  }, [queryParams.page]);

  const pagination = useMemo<PaginationState>(() => {
    return {
      pageSize: queryParams.size,
      pageIndex: queryParams.page - 1,
    };
  }, [queryParams.size, queryParams.page]);

  const onPaginationChange = (updater: Updater<PaginationState>) => {
    const newPaginationState = typeof updater === 'function' ? updater({ pageSize, pageIndex: pageNumber }) : updater;
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      const pageSizeChanged = newPaginationState.pageSize !== pageSize;
      if (pageSizeChanged) {
        setParamIfNotDefault(params, 'size', String(newPaginationState.pageSize));
        setParamIfNotDefault(params, 'page', '1');
        return params;
      }
      setParamIfNotDefault(params, 'page', String(newPaginationState.pageIndex + 1));
      return params;
    });
  };

  return {
    sorting,
    onSortingChange,
    columnFilters,
    onColumnFiltersChange,
    pageSize,
    pagination,
    onPaginationChange,
    columnVisibility,
    setColumnVisibility,
    rowSelection,
    globalSearch,
    setGlobalSearch,
  };
};

export default useTableProps;
