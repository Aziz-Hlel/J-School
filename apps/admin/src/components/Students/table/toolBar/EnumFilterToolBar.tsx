import { Button } from '@/components/ui/button';
import type { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';
import React from 'react';
import type { TableRowType } from '../../core/types';
import { DataTableFacetedFilter } from './faceted-filter';

type EnumFilterToolBarProps = {
  table: Table<TableRowType>;
  filters: {
    columnId: keyof TableRowType;
    title: string;
    options: {
      label: string;
      value: string;
      icon?: React.ComponentType<{ className?: string }>;
    }[];
  }[];
};

const EnumFilterToolBar = ({ table, filters }: EnumFilterToolBarProps) => {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <>
      <div className='flex gap-x-2'>
        {filters.map((filter) => {
          const column = table.getColumn(filter.columnId);
          if (!column) return null;
          return (
            <DataTableFacetedFilter
              key={filter.columnId}
              column={column}
              title={filter.title}
              options={filter.options}
            />
          );
        })}
      </div>
      {isFiltered && (
        <Button
          variant='ghost'
          onClick={() => {
            table.resetColumnFilters();
          }}
          className='h-8 px-2 lg:px-3'
        >
          Reset
          <X className='ms-2 h-4 w-4' />
        </Button>
      )}
    </>
  );
};

export default EnumFilterToolBar;
