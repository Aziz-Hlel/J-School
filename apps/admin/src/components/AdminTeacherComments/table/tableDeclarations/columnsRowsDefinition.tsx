import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import dayjs from '@/utils/dayjsConfig';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUp, ChevronsUpDown } from 'lucide-react';
import type { TableRowType } from '../../core/types';
import TeacherCommentView from '../../dialogs/view/teacher-comment-view';
import ActionsColumn from '../columns/ActionsColumn';
import HeaderContainer from '../ContainerComp/HeaderContainer';
import RowContainer from '../ContainerComp/RowContainer';

type ColumnDefCustom<T> = ColumnDef<T> & { accessorKey?: keyof T };

const columnsRowsDefinition: ColumnDefCustom<TableRowType>[] = [
  {
    id: 'teacherInfo',
    accessorFn: (row) => `${row.teacher.firstName} ${row.teacher.lastName}`,
    header: ({ column }) => (
      <HeaderContainer onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        <span>Teacher</span>
        {column.getIsSorted() === 'asc' && <ArrowUp />}
        {column.getIsSorted() === 'desc' && <ArrowUp className='rotate-180' />}
        {column.getIsSorted() === false && <ChevronsUpDown />}
      </HeaderContainer>
    ),
    cell: ({ row }) => (
      <RowContainer className='flex items-center space-x-2'>
        <Avatar className='h-8 w-8'>
          <AvatarImage src={row.original.teacher.avatar?.url} />
          <AvatarFallback>{`${row.original.teacher.firstName[0]}${row.original.teacher.lastName[0]}`}</AvatarFallback>
        </Avatar>
        <span>{`${row.original.teacher.firstName} ${row.original.teacher.lastName}`}</span>
      </RowContainer>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    id: 'studentInfo',
    accessorFn: (row) =>
      `${row.student.firstName.ar || row.student.firstName.en} ${row.student.lastName.ar || row.student.lastName.en}`,
    header: ({ column }) => (
      <HeaderContainer onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        <span>Student</span>
        {column.getIsSorted() === 'asc' && <ArrowUp />}
        {column.getIsSorted() === 'desc' && <ArrowUp className='rotate-180' />}
        {column.getIsSorted() === false && <ChevronsUpDown />}
      </HeaderContainer>
    ),
    cell: ({ row }) => (
      <RowContainer className='flex items-center space-x-2'>
        <Avatar className='h-8 w-8'>
          <AvatarImage src={row.original.student.avatar?.url} />
          <AvatarFallback>
            {`${
              row.original.student.firstName.ar?.[0] || row.original.student.firstName.en?.[0]
            }${row.original.student.lastName.ar?.[0] || row.original.student.lastName.en?.[0]}`}
          </AvatarFallback>
        </Avatar>
        <span>
          {`${
            row.original.student.firstName.ar || row.original.student.firstName.en
          } ${row.original.student.lastName.ar || row.original.student.lastName.en}`}
        </span>
      </RowContainer>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    id: 'title',
    accessorKey: 'title',
    header: ({ column }) => (
      <HeaderContainer onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        <span>Title</span>
        {column.getIsSorted() === 'asc' && <ArrowUp />}
        {column.getIsSorted() === 'desc' && <ArrowUp className='rotate-180' />}
        {column.getIsSorted() === false && <ChevronsUpDown />}
      </HeaderContainer>
    ),
    cell: ({ getValue }) => {
      const title = getValue<string>();
      return <RowContainer className='w-96 truncate whitespace-nowrap'>{title}</RowContainer>;
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    id: 'canParentReply',
    accessorKey: 'canParentReply',
    header: ({ column }) => (
      <HeaderContainer onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        <span>Parent Reply</span>
        {column.getIsSorted() === 'asc' && <ArrowUp />}
        {column.getIsSorted() === 'desc' && <ArrowUp className='rotate-180' />}
        {column.getIsSorted() === false && <ChevronsUpDown />}
      </HeaderContainer>
    ),
    cell: ({ getValue }) => {
      const canParentReply = getValue<boolean>();
      return <RowContainer>{canParentReply ? 'Yes' : 'No'}</RowContainer>;
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'updatedAt',
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
    cell: ({ row }) => {
      return (
        <RowContainer className='w-full'>
          <TeacherCommentView teacherComment={row.original}>
            <Button variant='link' className='text-blue-400 hover:text-blue-500'>
              View
            </Button>
          </TeacherCommentView>
        </RowContainer>
      );
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
