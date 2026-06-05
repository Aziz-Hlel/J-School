import type { Table } from '@tanstack/react-table';
import type { TableRowType } from '../../core/types';
import TableDataRows from '../tableComposites/TableDataRows';
import { EmptyRows, LoadingInRowsComp, NoResultComp } from '../tableDeclarations/FillerRows';

type TableBodyContentProps = {
  table: Table<TableRowType>;
  isLoading: boolean;
  pageSize: number;
};

const TableBodyContent = ({ table, isLoading, pageSize }: TableBodyContentProps) => {
  const isTableNotEmpty = table.getRowModel().rows?.length !== 0;
  const rowCount = table.getRowModel().rows.length;
  const isEmpty = !isLoading && rowCount === 0;
  const isPartial = !isLoading && rowCount > 0 && rowCount < pageSize;
  const nbrEmptyRows = pageSize - table.getRowModel().rows.length;

  return (
    <>
      {!isLoading && isTableNotEmpty && <TableDataRows<TableRowType> table={table} />}
      {!isLoading && isPartial && <EmptyRows<TableRowType> emptyRows={nbrEmptyRows} table={table} />}
      {isLoading && <LoadingInRowsComp<TableRowType> pageSize={pageSize} table={table} />}
      {!isLoading && isEmpty && <NoResultComp<TableRowType> table={table} emptyRows={pageSize} />}
    </>
  );
};

export default TableBodyContent;
