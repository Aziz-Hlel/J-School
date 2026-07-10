import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useMemo } from 'react';
import columnsRowsDefinition from './table/tableDeclarations/columnsRowsDefinition';
import useGetTableData from './table/use-get-table-data';
import useTableProps from './table/use-table-props';

const useMyTable = () => {
  const { tableData, pagination, isLoading } = useGetTableData();

  const tableColumns = useMemo(() => columnsRowsDefinition, []);

  const {
    sorting,
    onSortingChange,
    columnFilters,
    onColumnFiltersChange,
    pageSize,
    pagination: tanStackPagination,
    onPaginationChange,
    columnVisibility,
    setColumnVisibility,
    rowSelection,
    globalSearch,
    setGlobalSearch,
  } = useTableProps();

  const table = useReactTable({
    data: tableData,
    columns: tableColumns,

    onSortingChange: onSortingChange,
    onColumnFiltersChange: onColumnFiltersChange,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: onPaginationChange,
    onGlobalFilterChange: setGlobalSearch,

    manualPagination: true,
    pageCount: pagination.totalPages,

    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter: globalSearch,
      pagination: tanStackPagination,
    },
  });

  return { table, pageSize, isLoading };
};

export default useMyTable;
