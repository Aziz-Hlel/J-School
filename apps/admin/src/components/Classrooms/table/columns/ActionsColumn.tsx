import { EllipsisVertical, Trash2, SquarePen } from 'lucide-react';
import React, { Fragment } from 'react';
import type { TableRowType } from '../../core/types';
import type { Row } from '@tanstack/react-table';
import { useSelectedRow } from '../../context/selected-row-provider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import RowContainer from '../ContainerComp/RowContainer';
import { Button } from '@/components/ui/button';

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
      key: 'delete',
      label: 'Delete',
      icon: <Trash2 size={16} className='text-red-500' />,
      isVisible: true,
      onClick: () => {
        handleDialogStateChange({ openDialog: 'delete', selectedRow: row.original });
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
