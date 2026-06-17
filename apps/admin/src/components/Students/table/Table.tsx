import { Table, TableBody } from '@/components/ui/table';
import { type TableRowType } from './core/types';
import { DataTablePagination } from './table/pagination/Pagination';
import TableHeaders from './table/tableComposites/TableHeaders';
import TableBodyContent from './table/TableMainComp/TableBodyContent';
import { DataTableToolbar } from './table/toolBar/DataTableToolbar';
import tableFilters from './table/toolBar/Filters/ColumnFilters';
import useMyTable from './use-my-table';

const MainTable = () => {
  const { table, pageSize, isLoading } = useMyTable();

  return (
    <>
      <div className='flex w-full max-w-full flex-col gap-4'>
        <DataTableToolbar table={table} filters={tableFilters} />
        <div className='overflow-hidden rounded-md border'>
          <Table className='table-fixed'>
            <TableHeaders<TableRowType> table={table} />
            <TableBody>
              <TableBodyContent table={table} isLoading={isLoading} pageSize={pageSize} />
            </TableBody>
          </Table>
        </div>
        <div>
          <DataTablePagination table={table} className='mt-auto' />
        </div>
      </div>
    </>
  );
};

export default MainTable;
