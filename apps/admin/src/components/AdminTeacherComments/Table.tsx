import { Table, TableBody } from '../ui/table';
import TableHeaders from './table/tableComposites/TableHeaders';
import { DataTableToolbar } from './table/toolBar/DataTableToolbar';
import { DataTablePagination } from './table/pagination/Pagination';
import { type TableRowType } from './core/types';
import useMyTable from './use-my-table';
import TableBodyContent from './table/TableMainComp/TableBodyContent';

const MainTable = () => {
  const { table, pageSize, isLoading } = useMyTable();

  return (
    <>
      <div className='flex w-full max-w-full flex-col gap-4'>
        <DataTableToolbar table={table} filters={[]} />
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
