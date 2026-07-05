import { studentService } from '@/api/service/studentService';
import { useCurrentSchoolId } from '@/context/SchoolContext';
import type { FeesResponse } from '@repo/contracts/schemas/Fees/response';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useParams } from 'react-router';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

import { Calendar, CreditCard, Pencil, Plus, Trash } from 'lucide-react';
import AddFees from './AddFees';
import DeleteFee from './DeleteFee';
import EditFee from './EditFee';
import StudentFeesItem from './StudentFeesItem';

const StudentFees = () => {
  const { studentId } = useParams();
  const schoolId = useCurrentSchoolId();

  // Primary TanStack Query
  const { data } = useQuery({
    queryKey: ['students', studentId, 'fees'],
    queryFn: () => studentService.getFees(schoolId, studentId),
    enabled: !!studentId,
  });
  const fees = data?.data ?? null;

  const [selectedFeeId, setSelectedFeeId] = useState<string | null>(null);
  const selectedFee = fees?.find((fee) => fee.id === selectedFeeId) ?? null;
  // Dialog state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIddeleteOpen] = useState(false);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const getStatusConfig = (status: string) => {
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
      case 'OVERDUE':
        return {
          label: 'Overdue',
          className:
            'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/50',
        };
      default:
        return {
          label: status || 'Unknown',
          className:
            'bg-slate-50 text-slate-700 border-slate-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700',
        };
    }
  };

  const handleOpenEdit = (fee: FeesResponse, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFeeId(fee.id);
    setIsEditOpen(true);
  };

  const handleOpenDelete = (fee: FeesResponse, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFeeId(fee.id);
    setIddeleteOpen(true);
  };

  return (
    <div className='grid grid-cols-2 gap-6 p-4'>
      {/* Left side: Fee Cycles List */}
      <div className='space-y-4 border-r border-slate-100 pr-4 dark:border-zinc-800'>
        <div className='flex items-center justify-between'>
          <div>
            <h3 className='text-lg font-semibold text-slate-800 dark:text-slate-200'>Billing Cycles</h3>
            <p className='text-muted-foreground text-xs'>Manage billing cycles and active fee lists.</p>
          </div>
          <AddFees studentId={studentId}>
            <Button size='sm' className='bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 rounded-xl'>
              <Plus className='h-4 w-4' />
              Add Fee
            </Button>
          </AddFees>
        </div>

        <Separator className='bg-slate-100 dark:bg-zinc-800' />

        <div className='max-h-[calc(100vh-280px)] space-y-3 overflow-y-auto pr-1'>
          {fees.length === 0 ? (
            <div className='flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 px-4 py-12 text-center dark:border-zinc-800'>
              <CreditCard className='text-muted-foreground/50 mb-3 h-10 w-10' />
              <p className='text-sm font-semibold text-slate-800 dark:text-slate-200'>No Fees Found</p>
              <p className='text-muted-foreground mt-1 mb-4 max-w-50 text-xs'>
                There are no fee cycles registered for this student.
              </p>
              <AddFees studentId={studentId ?? ''}>
                <Button variant='outline' size='sm' className='rounded-xl text-xs'>
                  Create First Fee
                </Button>
              </AddFees>
            </div>
          ) : (
            fees.map((fee) => {
              const isSelected = selectedFee?.id === fee.id;
              const statusCfg = getStatusConfig(fee.status);

              return (
                <div
                  key={fee.id}
                  onClick={() => setSelectedFeeId(fee.id)}
                  className={`group relative cursor-pointer rounded-xl border p-4 transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-sm'
                      : 'bg-card border-slate-200 hover:border-slate-300 hover:bg-slate-50 dark:border-zinc-800 dark:hover:border-zinc-700 dark:hover:bg-zinc-900/50'
                  }`}
                >
                  {isSelected && <div className='bg-primary absolute top-0 bottom-0 left-0 w-1 rounded-l-xl' />}

                  <div className='flex items-start justify-between gap-2'>
                    <div className='space-y-1'>
                      <h4 className='group-hover:text-primary text-sm font-semibold text-slate-950 transition-colors dark:text-slate-200'>
                        {fee.name || 'Unnamed Fee Cycle'}
                      </h4>
                      <div className='text-muted-foreground flex items-center gap-1.5 text-xs'>
                        <Calendar className='h-3.5 w-3.5' />
                        <span>
                          {formatDate(fee.startDate)} - {formatDate(fee.endDate)}
                        </span>
                      </div>
                    </div>
                    <div className='flex flex-col items-end gap-2'>
                      <Badge
                        className={`rounded-full border px-2 py-0.5 text-[10px] font-medium shadow-none ${statusCfg.className}`}
                      >
                        {statusCfg.label}
                      </Badge>
                      <span className='text-[11px] font-medium text-slate-500'>{fee.items?.length || 0} items</span>
                    </div>
                  </div>

                  <div className='mt-4 flex items-center justify-end gap-2 border-t border-slate-100 pt-3 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100 dark:border-zinc-900'>
                    <Button
                      size='sm'
                      variant='ghost'
                      className='text-muted-foreground h-7 gap-1 rounded-md px-2 text-xs hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/20'
                      onClick={(e) => handleOpenDelete(fee, e)}
                    >
                      <Trash className='h-3 w-3' />
                      Delete
                    </Button>
                    <Button
                      size='sm'
                      variant='ghost'
                      className='text-muted-foreground h-7 gap-1 rounded-md px-2 text-xs hover:text-slate-800 dark:hover:text-slate-200'
                      onClick={(e) => handleOpenEdit(fee, e)}
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
      </div>

      {/* Right side: Fee Items Details */}
      <div>
        <StudentFeesItem fee={selectedFee} studentId={studentId ?? ''} />
      </div>

      {isEditOpen && selectedFee && <EditFee fee={selectedFee} studentId={studentId} setIsEditOpen={setIsEditOpen} />}
      {isDeleteOpen && selectedFee && (
        <DeleteFee feeId={selectedFee.id} studentId={studentId} setIsDeleteOpen={() => setIddeleteOpen(false)} />
      )}
    </div>
  );
};

export default StudentFees;
