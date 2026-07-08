import { TableCell, TableRow } from '@/components/ui/table';
import { flexRender, type Table } from '@tanstack/react-table';

const TableDataRows = <T,>({ table }: { table: Table<T> }) => {
  return table.getRowModel().rows.map((row) => (
    <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'} className='hover:bg-muted'>
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
      ))}
    </TableRow>
  ));
};

export default TableDataRows;
