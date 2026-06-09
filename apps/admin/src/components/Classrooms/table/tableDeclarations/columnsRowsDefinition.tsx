import dayjs from '@/utils/dayjsConfig';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUp, ChevronsUpDown } from 'lucide-react';
import type { TableRowKeys, TableRowType } from '../../core/types';
import ActionsColumn from '../columns/ActionsColumn';
import HeaderContainer from '../ContainerComp/HeaderContainer';
import RowContainer from '../ContainerComp/RowContainer';

type ColumnDefCustom<TableRowType, TableKeys> = ColumnDef<TableRowType> & {
  accessorKey?: TableKeys;
  accessorFn?: (row: TableRowType) => unknown;
};

const columnsRowsDefinition: ColumnDefCustom<TableRowType, TableRowKeys>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <HeaderContainer onClick={() => column.getCanSort() && column.toggleSorting(column.getIsSorted() === 'asc')}>
          <span>Name</span>
          {column.getCanSort() && (
            <>
              {column.getIsSorted() === 'asc' && <ArrowUp />}
              {column.getIsSorted() === 'desc' && <ArrowUp className='rotate-180' />}
              {column.getIsSorted() === false && <ChevronsUpDown />}
            </>
          )}
        </HeaderContainer>
      );
    },
    cell: ({ getValue }) => {
      const enName = getValue<string>();
      return <RowContainer className='w-96 truncate whitespace-nowrap'>{enName}</RowContainer>;
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: 'grade',
    accessorKey: 'grade',
    header: ({ column }) => {
      return (
        <HeaderContainer onClick={() => column.getCanSort() && column.toggleSorting(column.getIsSorted() === 'asc')}>
          <span>Grade</span>
          {column.getCanSort() && (
            <>
              {column.getIsSorted() === 'asc' && <ArrowUp />}
              {column.getIsSorted() === 'desc' && <ArrowUp className='rotate-180' />}
              {column.getIsSorted() === false && <ChevronsUpDown />}
            </>
          )}
        </HeaderContainer>
      );
    },
    cell: ({ getValue }) => {
      const firstName = getValue<string>();
      return <RowContainer className='w-96 truncate whitespace-nowrap'>{firstName}</RowContainer>;
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: 'description',
    accessorKey: 'description',
    header: ({ column }) => {
      return (
        <HeaderContainer onClick={() => column.getCanSort() && column.toggleSorting(column.getIsSorted() === 'asc')}>
          <span>Description</span>
          {column.getCanSort() && (
            <>
              {column.getIsSorted() === 'asc' && <ArrowUp />}
              {column.getIsSorted() === 'desc' && <ArrowUp className='rotate-180' />}
              {column.getIsSorted() === false && <ChevronsUpDown />}
            </>
          )}
        </HeaderContainer>
      );
    },
    cell: ({ getValue }) => {
      const description = getValue<string | null>();
      return <RowContainer className='w-96 truncate whitespace-nowrap'>{description ?? '-'}</RowContainer>;
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return (
        <HeaderContainer onClick={() => column.getCanSort() && column.toggleSorting(column.getIsSorted() === 'asc')}>
          <span>Created At</span>
          {column.getCanSort() && (
            <>
              {column.getIsSorted() === 'asc' && <ArrowUp />}
              {column.getIsSorted() === 'desc' && <ArrowUp className='rotate-180' />}
              {column.getIsSorted() === false && <ChevronsUpDown />}
            </>
          )}
        </HeaderContainer>
      );
    },
    cell: ({ getValue }) => {
      const dateString = getValue<string>();
      const formattedDate = dayjs(dateString).format('LL');
      return <RowContainer className='w-full'>{formattedDate}</RowContainer>;
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: 'actions',
    cell: ({ row }) => <ActionsColumn row={row} />,
    size: 32,
    minSize: 32,
    maxSize: 32,
    enableSorting: false,
    enableHiding: false,
  },
];

export default columnsRowsDefinition;
