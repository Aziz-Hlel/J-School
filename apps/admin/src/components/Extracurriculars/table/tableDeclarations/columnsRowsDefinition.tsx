import dayjs from '@/utils/dayjsConfig';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUp, ChevronsUpDown } from 'lucide-react';
import { Link } from 'react-router';
import type { TableRowType } from '../../core/types';
import ActionsColumn from '../columns/ActionsColumn';
import HeaderContainer from '../ContainerComp/HeaderContainer';
import RowContainer from '../ContainerComp/RowContainer';

type ColumnDefCustom<T> = ColumnDef<T> & { accessorKey?: keyof T };

const columnsRowsDefinition: ColumnDefCustom<TableRowType>[] = [
  {
    id: 'title',
    accessorKey: 'title',
    accessorFn: (row: TableRowType) => row.title?.en || '',
    header: ({ column }) => {
      return (
        <HeaderContainer onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          <span>Title</span>
          {column.getIsSorted() === 'asc' && <ArrowUp />}
          {column.getIsSorted() === 'desc' && <ArrowUp className='rotate-180' />}
          {column.getIsSorted() === false && <ChevronsUpDown />}
        </HeaderContainer>
      );
    },
    cell: ({ getValue, row }) => {
      const title = getValue<string>();
      return (
        <RowContainer className='w-96 truncate whitespace-nowrap'>
          <Link
            className='hover:text-primary font-semibold underline-offset-4 hover:underline'
            to={`/extracurriculars/${row.original.id}/overview`}
          >
            {title}
          </Link>
        </RowContainer>
      );
    },
    enableSorting: true,
    enableHiding: true,
    enableGlobalFilter: true,
  },
  {
    id: 'sessionType',
    accessorKey: 'session',
    accessorFn: (row: TableRowType) => row.session?.type || '',
    header: ({ column }) => {
      return (
        <HeaderContainer onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          <span>Session Type</span>
          {column.getIsSorted() === 'asc' && <ArrowUp />}
          {column.getIsSorted() === 'desc' && <ArrowUp className='rotate-180' />}
          {column.getIsSorted() === false && <ChevronsUpDown />}
        </HeaderContainer>
      );
    },
    cell: ({ getValue }) => {
      const type = getValue<string>();
      return <RowContainer className='w-48 capitalize'>{type ? type.toLowerCase() : '-'}</RowContainer>;
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: 'sessionSchedule',
    accessorKey: 'session',
    header: () => (
      <HeaderContainer>
        <span>Schedule</span>
      </HeaderContainer>
    ),
    cell: ({ row }) => {
      const session = row.original.session;
      if (!session) return <RowContainer>-</RowContainer>;
      const timeStr = session.startTime && session.endTime ? ` (${session.startTime} - ${session.endTime})` : '';
      if (session.type === 'WEEKLY') {
        return (
          <RowContainer className='w-96 truncate whitespace-nowrap'>{`${session.day || ''}${timeStr}`}</RowContainer>
        );
      }
      const dateStr = session.date ? dayjs(session.date).format('LL') : '';
      return <RowContainer className='w-96 truncate whitespace-nowrap'>{`${dateStr}${timeStr}` || '-'}</RowContainer>;
    },
  },
  {
    id: 'teacher',
    accessorKey: 'teacher',
    accessorFn: (row: TableRowType) => (row.teacher ? `${row.teacher.firstName} ${row.teacher.lastName}` : ''),
    header: ({ column }) => {
      return (
        <HeaderContainer onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          <span>Teacher</span>
          {column.getIsSorted() === 'asc' && <ArrowUp />}
          {column.getIsSorted() === 'desc' && <ArrowUp className='rotate-180' />}
          {column.getIsSorted() === false && <ChevronsUpDown />}
        </HeaderContainer>
      );
    },
    cell: ({ getValue }) => {
      const teacherName = getValue<string>();
      return <RowContainer className='w-96 truncate whitespace-nowrap'>{teacherName || '-'}</RowContainer>;
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return (
        <HeaderContainer onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          <span>Created At</span>
          {column.getIsSorted() === 'asc' && <ArrowUp />}
          {column.getIsSorted() === 'desc' && <ArrowUp className='rotate-180' />}
          {column.getIsSorted() === false && <ChevronsUpDown />}
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
