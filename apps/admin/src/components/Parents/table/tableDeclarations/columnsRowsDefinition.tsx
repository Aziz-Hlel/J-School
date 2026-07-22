import dayjs from '@/utils/dayjsConfig';
import type { ColumnDef } from '@tanstack/react-table';
import type { TableRowType } from '../../core/types';
import ActionsColumn from '../columns/ActionsColumn';
import HeaderContainer from '../ContainerComp/HeaderContainer';
import RowContainer from '../ContainerComp/RowContainer';

type ColumnDefCustom<T> = ColumnDef<T> & { accessorKey?: keyof T };

const columnsRowsDefinition: ColumnDefCustom<TableRowType>[] = [
  {
    id: 'email',
    accessorKey: 'email',
    accessorFn: (row: TableRowType) => ({
      email: row.email,
    }),
    header: ({ column }) => {
      return (
        <HeaderContainer
          name='table.email'
          column={column}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        />
      );
    },
    cell: ({ getValue }) => {
      const { email } = getValue<{
        email: string;
      }>();
      return <RowContainer className='w-96 lowercase'>{email}</RowContainer>;
    },

    enableSorting: true,
    enableHiding: true,
    enableGlobalFilter: true,
  },
  {
    id: 'firstName',
    accessorKey: 'firstName',
    header: ({ column }) => {
      return (
        <HeaderContainer
          name='table.firstName'
          column={column}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        />
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
    id: 'lastName',
    accessorKey: 'lastName',
    header: ({ column }) => {
      return (
        <HeaderContainer
          name='table.lastName'
          column={column}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        />
      );
    },
    cell: ({ getValue }) => {
      const lastName = getValue<string>();
      return <RowContainer className='w-96 truncate whitespace-nowrap'>{lastName}</RowContainer>;
    },

    enableSorting: true,
    enableHiding: true,
  },
  {
    id: 'phone',
    accessorKey: 'phone',
    header: ({ column }) => {
      return (
        <HeaderContainer
          name='table.phone'
          column={column}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        />
      );
    },
    cell: ({ getValue }) => {
      const phone = getValue<string>();
      return <RowContainer className='w-96 truncate whitespace-nowrap'>{phone}</RowContainer>;
    },

    enableSorting: true,
    enableHiding: true,
  },
  // {
  //   id: 'status',
  //   accessorKey: 'status',
  //   header: ({ column }) => {
  //     return (
  //       <HeaderContainer
  //         name='table.status'
  //         column={column}
  //         onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
  //       />
  //     );
  //   },
  //   cell: ({ getValue }) => {
  //     const status = getValue<StatusType>();
  //     return (
  //       <RowContainer className="">
  //         <StatusComponent value={status} />
  //       </RowContainer>
  //     );
  //   },
  //   enableSorting: true,
  //   enableHiding: true,
  // },
  // {
  //   id: 'price',
  //   accessorKey: 'price',
  //   header: ({ column }) => {
  //     return (
  //       <HeaderContainer
  //         name='table.price'
  //         column={column}
  //         onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
  //       />
  //     );
  //   },
  //   cell: ({ getValue }) => {
  //     const price = getValue<string>();
  //     return <RowContainer className=" w-96 truncate whitespace-nowrap ">{price}</RowContainer>;
  //   },
  //   enableSorting: true,
  //   enableHiding: true,
  // },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return (
        <HeaderContainer
          name='table.createdAt'
          column={column}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        />
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
