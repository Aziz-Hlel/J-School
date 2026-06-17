import dayjs from '@/utils/dayjsConfig';
import { GradeMapping } from '@repo/contracts/map/GradeMapping';
import type { Gender, StudentStatus } from '@repo/contracts/types/enums/enums';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUp, ChevronsUpDown } from 'lucide-react';
import GenderComponent from '../../columns/enum/gender/GenderComponent';
import StatusComponent from '../../columns/enum/status/StatusComponent';
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
    id: 'uid',
    accessorKey: 'uid',
    accessorFn: (row: TableRowType) => ({
      uid: row.uid,
    }),
    header: ({ column }) => {
      return (
        <HeaderContainer onClick={() => column.getCanSort() && column.toggleSorting(column.getIsSorted() === 'asc')}>
          <span>Unique Identifier</span>
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
      const { uid } = getValue<{
        uid: string;
      }>();
      return <RowContainer className='w-96 lowercase'>{uid}</RowContainer>;
    },

    enableSorting: false,
    enableHiding: true,
    enableGlobalFilter: true,
  },
  {
    id: 'english_name',
    accessorFn: (row: TableRowType) => `${row.firstName.en} ${row.lastName.en}`,
    header: ({ column }) => {
      return (
        <HeaderContainer onClick={() => column.getCanSort() && column.toggleSorting(column.getIsSorted() === 'asc')}>
          <span>Name En</span>
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
    id: 'arabic_name',
    accessorFn: (row: TableRowType) => `${row.firstName.ar} ${row.lastName.ar}`,
    header: ({ column }) => {
      return (
        <HeaderContainer onClick={() => column.getCanSort() && column.toggleSorting(column.getIsSorted() === 'asc')}>
          <span>Name Ar</span>
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
    id: 'grade',
    accessorFn: (row: TableRowType) =>
      row.classroom ? `${GradeMapping[row.classroom.grade]}-${row.classroom.name}` : 'N/A',
    header: ({ column }) => {
      return (
        <HeaderContainer onClick={() => column.getCanSort() && column.toggleSorting(column.getIsSorted() === 'asc')}>
          <span>Class</span>
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
      const className = getValue<string>();
      return <RowContainer className='w-96 truncate whitespace-nowrap'>{className}</RowContainer>;
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: ({ column }) => {
      return (
        <HeaderContainer onClick={() => column.getCanSort() && column.toggleSorting(column.getIsSorted() === 'asc')}>
          <span>Status</span>
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
      const status = getValue<StudentStatus>();
      return (
        <RowContainer className=''>
          <StatusComponent value={status} />
        </RowContainer>
      );
    },

    enableSorting: true,
    enableHiding: true,
  },
  {
    id: 'gender',
    accessorKey: 'gender',
    header: ({ column }) => {
      return (
        <HeaderContainer onClick={() => column.getCanSort() && column.toggleSorting(column.getIsSorted() === 'asc')}>
          <span>Gender</span>
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
      const gender = getValue<Gender>();
      return (
        <RowContainer className=''>
          <GenderComponent value={gender} />
        </RowContainer>
      );
    },

    enableSorting: false,
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
