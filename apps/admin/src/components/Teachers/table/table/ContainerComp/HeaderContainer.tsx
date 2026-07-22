import { cn } from '@/lib/utils';
import type { Column } from '@tanstack/react-table';
import type { ParseKeys } from 'i18next';
import { ArrowUp, ChevronsUpDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { TableRowType } from '../../core/types';

type HeaderContainerProps<TValue> = React.ComponentProps<'div'> & {
  column: Column<TableRowType, TValue>;
  name: ParseKeys<'staff'>;
};

const HeaderContainer = <TValue,>({ name, column, ...props }: HeaderContainerProps<TValue>) => {
  const { t } = useTranslation(['staff']);
  return (
    <div
      className={cn(
        "flex w-auto cursor-pointer items-center justify-start space-x-2 truncate rounded-md ps-2 text-sm font-medium whitespace-nowrap transition-all [&_svg:not([class*='size-'])]:size-4",
        props.className,
      )}
      {...props}
    >
      <span>{t(name)}</span>
      {column.getCanSort() && (
        <>
          {column.getIsSorted() === 'asc' && <ArrowUp />}
          {column.getIsSorted() === 'desc' && <ArrowUp className='rotate-180' />}
          {column.getIsSorted() === false && <ChevronsUpDown />}
        </>
      )}
    </div>
  );
};

export default HeaderContainer;
