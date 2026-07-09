import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { FeeItemsResponse } from '@repo/contracts/schemas/FeeItems/response';
import type { FeesResponse } from '@repo/contracts/schemas/Fees/response';
import { DollarSign, Lock, Pencil, Plus, Receipt, Trash } from 'lucide-react';
import { useState } from 'react';
import AddFeeItem from './AddFeeItem';
import DeleteFeeItem from './DeleteFeeItem';
import EditFeeItem from './EditFeeItem';

// ── helpers ─────────────────────────────────────────────────────────────────

const getItemStatusConfig = (status: string) => {
  switch (status?.toUpperCase()) {
    case 'PAID':
      return {
        label: 'Paid',
        className:
          'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50',
      };
    case 'UNPAID':
      return {
        label: 'Unpaid',
        className:
          'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50',
      };
    case 'PARTIALLY_PAID':
      return {
        label: 'Partially Paid',
        className:
          'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/50',
      };
    default:
      return {
        label: status || 'Unknown',
        className:
          'bg-slate-50 text-slate-700 border-slate-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700',
      };
  }
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);

// ── component ────────────────────────────────────────────────────────────────

interface StudentFeesItemProps {
  fee: FeesResponse | null;
  studentId: string;
}

const StudentFeesItem = ({ fee, studentId }: StudentFeesItemProps) => {
  const [selectedItem, setSelectedItem] = useState<FeeItemsResponse | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const isLocked = fee?.status === 'PAID';
  const items = (fee?.items ?? []) as FeeItemsResponse[];

  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
  const paidAmount = items.filter((i) => i.status === 'PAID').reduce((sum, item) => sum + item.amount, 0);

  const handleOpenEdit = (item: FeeItemsResponse, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedItem(item);
    setIsEditOpen(true);
  };

  const handleOpenDelete = (item: FeeItemsResponse, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedItem(item);
    setIsDeleteOpen(true);
  };

  // ── empty state ──────────────────────────────────────────────────────────
  if (!fee) {
    return (
      <div className='flex h-full flex-col items-center justify-center px-6 py-20 text-center'>
        <div className='mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-zinc-800'>
          <Receipt className='text-muted-foreground/50 h-7 w-7' />
        </div>
        <p className='text-sm font-semibold text-slate-800 dark:text-slate-200'>No fee selected</p>
        <p className='text-muted-foreground mt-1 max-w-48 text-xs'>
          Click on a billing cycle on the left to view its items.
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-4 pl-4'>
      {/* Header */}
      <div className='flex items-start justify-between gap-2'>
        <div>
          <div className='flex items-center gap-2'>
            <h3 className='text-lg font-semibold text-slate-800 dark:text-slate-200'>
              {fee.name || 'Unnamed Fee Cycle'}
            </h3>
            {isLocked && (
              <span
                title='This fee is fully paid and locked'
                className='inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400'
              >
                <Lock className='h-2.5 w-2.5' />
                Fully Paid
              </span>
            )}
          </div>
          <p className='text-muted-foreground text-xs'>
            {items.length} item{items.length !== 1 ? 's' : ''} · {formatCurrency(paidAmount)} paid of{' '}
            {formatCurrency(totalAmount)}
          </p>
        </div>

        <AddFeeItem studentId={studentId} feeId={fee.id}>
          <Button size='sm' className='bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 rounded-xl'>
            <Plus className='h-4 w-4' />
            Add Item
          </Button>
        </AddFeeItem>
      </div>

      <Separator className='bg-slate-100 dark:bg-zinc-800' />

      {/* Items list */}
      <div className='max-h-[calc(100vh-300px)] space-y-2 overflow-y-auto pr-1'>
        {items.length === 0 ? (
          <div className='flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 px-4 py-12 text-center dark:border-zinc-800'>
            <DollarSign className='text-muted-foreground/50 mb-3 h-10 w-10' />
            <p className='text-sm font-semibold text-slate-800 dark:text-slate-200'>No items yet</p>
            <p className='text-muted-foreground mt-1 mb-4 max-w-48 text-xs'>
              This fee cycle has no items. Add one to get started.
            </p>

            <AddFeeItem studentId={studentId} feeId={fee.id}>
              <Button variant='outline' size='sm' className='rounded-xl text-xs'>
                Add First Item
              </Button>
            </AddFeeItem>
          </div>
        ) : (
          items.map((item) => {
            const statusCfg = getItemStatusConfig(item.status);
            return (
              <div
                key={item.id}
                className='group bg-card relative rounded-xl border border-slate-200 p-4 transition-all hover:border-slate-300 hover:bg-slate-50 dark:border-zinc-800 dark:hover:border-zinc-700 dark:hover:bg-zinc-900/50'
              >
                <div className='flex items-start justify-between gap-3'>
                  {/* Left: info */}
                  <div className='min-w-0 flex-1 space-y-0.5'>
                    <p className='truncate text-sm font-semibold text-slate-900 dark:text-slate-100'>{item.title}</p>
                    {item.description && (
                      <p className='text-muted-foreground line-clamp-1 text-xs'>{item.description}</p>
                    )}
                  </div>

                  {/* Right: amount + status */}
                  <div className='flex shrink-0 flex-col items-end gap-1.5'>
                    <span className='text-sm font-semibold text-slate-800 dark:text-slate-200'>
                      {formatCurrency(item.amount)}
                    </span>
                    <Badge
                      className={`rounded-full border px-2 py-0.5 text-[10px] font-medium shadow-none ${statusCfg.className}`}
                    >
                      {statusCfg.label}
                    </Badge>
                  </div>
                </div>

                {/* Action buttons */}
                <div className='mt-3 flex items-center justify-end gap-2 border-t border-slate-100 pt-2.5 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100 dark:border-zinc-900'>
                  <Button
                    size='sm'
                    variant='ghost'
                    className='text-muted-foreground h-7 gap-1 rounded-md px-2 text-xs hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/20'
                    onClick={(e) => handleOpenDelete(item, e)}
                  >
                    <Trash className='h-3 w-3' />
                    Delete
                  </Button>
                  <Button
                    size='sm'
                    variant='ghost'
                    className='text-muted-foreground h-7 gap-1 rounded-md px-2 text-xs hover:text-slate-800 dark:hover:text-slate-200'
                    onClick={(e) => handleOpenEdit(item, e)}
                  >
                    <Pencil className='h-3 w-3' />
                    Edit
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Dialogs */}
      {isEditOpen && selectedItem && (
        <EditFeeItem item={selectedItem} studentId={studentId} feeId={fee.id} setIsEditOpen={setIsEditOpen} />
      )}
      {isDeleteOpen && selectedItem && (
        <DeleteFeeItem
          studentId={studentId}
          feeId={fee.id}
          itemId={selectedItem.id}
          setIsDeleteOpen={() => setIsDeleteOpen(false)}
        />
      )}
    </div>
  );
};

export default StudentFeesItem;
