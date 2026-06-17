import { Spinner } from '@/components/ui/spinner';
import { TableCell, TableRow } from '@/components/ui/table';
import type { Table } from '@tanstack/react-table';
import RowContainer from '../ContainerComp/RowContainer';

interface LoadingInRowsCompProps<T> {
  table: Table<T>;
  pageSize: number;
}
export const LoadingInRowsComp = <T,>({ table, pageSize }: LoadingInRowsCompProps<T>) => {
  return (
    <>
      <TableRow className='pointer-events-none'>
        <TableCell className=' ' colSpan={table.getAllLeafColumns().length}>
          <RowContainer className='flex w-full items-center justify-center space-x-2 text-black opacity-100'>
            <Spinner /> <span>Loading...</span>
          </RowContainer>
        </TableCell>
      </TableRow>
      {pageSize > 1 && <EmptyRows emptyRows={pageSize - 1} table={table} />}
    </>
  );
};

interface NoResultCompProps<T> {
  table: Table<T>;
  emptyRows: number;
}
export const NoResultComp = <T,>({ table, emptyRows }: NoResultCompProps<T>) => {
  return (
    <>
      <TableRow className='pointer-events-none opacity-50'>
        <TableCell className='text-center text-black' colSpan={table.getAllLeafColumns().length}>
          <RowContainer>No Results</RowContainer>
        </TableCell>
      </TableRow>
      {emptyRows > 1 && <EmptyRows emptyRows={emptyRows - 1} table={table} />}
    </>
  );
};

export const EmptyRows = <T,>({ emptyRows, table }: { emptyRows: number; table: Table<T> }) => {
  return (
    <>
      {emptyRows > 0 &&
        [...Array(emptyRows)].map((_, i) => (
          <TableRow key={`empty-${i}`} className='pointer-events-none opacity-50'>
            <TableCell colSpan={table.getAllLeafColumns().length}>
              <RowContainer>&nbsp;</RowContainer>
            </TableCell>
          </TableRow>
        ))}
    </>
  );
};
