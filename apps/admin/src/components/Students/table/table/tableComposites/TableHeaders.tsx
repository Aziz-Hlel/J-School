import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { flexRender, type Table } from '@tanstack/react-table';

const TableHeaders = <T,>({ table }: { table: Table<T> }) => {
  return (
    <TableHeader>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            return (
              <TableHead
                className='group/head relative h-10 select-none last:[&>.cursor-col-resize]:opacity-0'
                key={header.id}
                {...{
                  colSpan: header.colSpan,
                  style: {
                    width: header.getSize(),
                  },
                }}
              >
                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            );
          })}
        </TableRow>
      ))}
    </TableHeader>
  );
};

export default TableHeaders;
