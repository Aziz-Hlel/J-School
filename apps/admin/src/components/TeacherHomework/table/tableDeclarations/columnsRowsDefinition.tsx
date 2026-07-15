import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUp, ChevronsUpDown } from 'lucide-react';
import type { TableRowType } from '../../core/types';
import HomeworkView from '../../dialogs/view/HomeworkView';
import ActionsColumn from '../columns/ActionsColumn';
import HeaderContainer from '../ContainerComp/HeaderContainer';
import RowContainer from '../ContainerComp/RowContainer';

type ColumnDefCustom<T> = ColumnDef<T> & { accessorKey?: keyof T };

const columnsRowsDefinition: ColumnDefCustom<TableRowType>[] = [
  {
    id: 'classroom',
    accessorKey: 'classroom',
    header: ({ column }) => {
      return (
        <HeaderContainer onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          <span>Classroom</span>
        </HeaderContainer>
      );
    },
    cell: ({ getValue }) => {
      const classroom = getValue<TableRowType['classroom']>();
      return (
        <RowContainer className='w-64'>
          <div className='flex items-center gap-2'>
            <Badge variant='secondary' className='shrink-0'>
              {classroom.grade}
            </Badge>
            <span className='truncate font-medium whitespace-nowrap'>{classroom.name}</span>
          </div>
        </RowContainer>
      );
    },

    enableSorting: false,
    enableHiding: true,
  },
  {
    id: 'subject',
    accessorKey: 'subject',
    header: ({ column }) => {
      return (
        <HeaderContainer onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          <span>Subject</span>
        </HeaderContainer>
      );
    },
    cell: ({ getValue }) => {
      const subject = getValue<TableRowType['subject']>();
      return (
        <RowContainer className='w-56'>
          <span className='truncate whitespace-nowrap normal-case'>{subject.name.fr}</span>
        </RowContainer>
      );
    },

    enableSorting: false,
    enableHiding: true,
  },
  {
    id: 'title',
    accessorKey: 'title',
    header: ({ column }) => {
      return (
        <HeaderContainer onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          <span>Homework Title</span>
        </HeaderContainer>
      );
    },
    cell: ({ getValue }) => {
      const title = getValue<TableRowType['title']>();
      return (
        <RowContainer className='w-56'>
          <span className='truncate whitespace-nowrap normal-case'>{title}</span>
        </RowContainer>
      );
    },

    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: 'due',
    header: ({ column }) => {
      return (
        <HeaderContainer onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          <span>Due Date</span>
          {column.getIsSorted() === 'asc' && <ArrowUp />}
          {column.getIsSorted() === 'desc' && <ArrowUp className='rotate-180' />}
          {column.getIsSorted() === false && <ChevronsUpDown />}
        </HeaderContainer>
      );
    },
    cell: ({ getValue }) => {
      const due = getValue<string>();
      return <RowContainer className='w-48 truncate whitespace-nowrap normal-case'>{due}</RowContainer>;
    },

    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'files',
    header: () => {
      return (
        <HeaderContainer>
          <span>View</span>
        </HeaderContainer>
      );
    },
    cell: ({ row }) => {
      return (
        <RowContainer className='w-full'>
          <HomeworkView homework={row.original}>
            <Button variant='link' className='text-blue-400 hover:text-blue-500'>
              View
            </Button>
          </HomeworkView>
        </RowContainer>
      );
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
