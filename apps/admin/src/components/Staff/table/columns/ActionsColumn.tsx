import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSetUserIdStore } from '@/shared/select-roles/select-roles-store';
import type { Row } from '@tanstack/react-table';
import { EllipsisVertical, LockKeyhole, Pencil, SquarePen } from 'lucide-react';
import React, { Fragment } from 'react';
import { useSelectedRow } from '../../context/selected-row-provider';
import type { TableRowType } from '../../core/types';
import RowContainer from '../ContainerComp/RowContainer';

type RowAction = {
  key: 'edit' | 'delete' | 'feature';
  label: string;
  icon: React.ReactNode;
  isPermitted: boolean;
  onClick: () => void;
  tooltipMessage?: string;
};

type RowActionState = {
  isPermitted: boolean;
  tooltipMessage?: string;
};

const ActionsColumn = ({ row }: { row: Row<TableRowType> }) => {
  const { handleDialogStateChange } = useSelectedRow();
  const setUserRole = useSetUserIdStore();

  const getActionState = (): RowActionState => {
    return {
      isPermitted: true,
      tooltipMessage: undefined,
    };
  };

  const actions: RowAction[] = [
    {
      key: 'edit',
      label: 'Edit',
      icon: <SquarePen size={16} className='text-green-500' />,
      isPermitted: true,
      onClick: () => handleDialogStateChange({ openDialog: 'edit', selectedRow: row.original }),
    },
    // {
    //   key: 'feature',
    //   label: row.original.isFeatured ? 'Unfeature' : 'Feature',
    //   icon: <Star size={16} className="text-amber-500" />,
    //   isPermitted: true,
    //   onClick: () => {
    //     setCurrentRow(row.original);
    //     handleDialogChange('feature');
    //   },
    // },
    {
      key: 'change-password',
      label: 'Change Password',
      icon: <LockKeyhole size={16} className='text-primary' />,
      isPermitted: true,
      onClick: () => handleDialogStateChange({ openDialog: 'change-password', selectedRow: row.original }),
    },
    {
      key: 'edit-roles',
      label: 'Edit Roles',
      icon: <Pencil size={16} className='text-amber-500' />,
      isVisible: true,
      onClick: () => {
        setUserRole(row.original.id);
      },
    },
  ].map((action) => ({
    ...action,
    ...getActionState(),
    key: action.key as RowAction['key'],
  }));

  return (
    <>
      <RowContainer className='justify-end ps-0'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className='flex justify-center'>
            <Button variant='ghost' className='data-[state=open]:bg-muted flex h-fit p-0 has-[>svg]:px-0'>
              <EllipsisVertical className='size-4 rotate-90 cursor-pointer rounded-full hover:bg-gray-200' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-40'>
            {actions.map((action) => (
              <Fragment key={action.key}>
                <DropdownMenuItem onClick={action.onClick}>
                  <span>{action.label}</span>
                  <DropdownMenuShortcut>{action.icon}</DropdownMenuShortcut>
                </DropdownMenuItem>
              </Fragment>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </RowContainer>
    </>
  );
};

export default ActionsColumn;
