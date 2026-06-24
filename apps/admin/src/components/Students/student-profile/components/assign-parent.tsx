import { parentStudentService } from '@/api/service/parentStudentService';
import schoolService from '@/api/service/schoolService';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import queryClient from '@/config/react-qeury';
import { useCurrentSchoolId } from '@/context/SchoolContext';
import type { Cursor } from '@repo/contracts/schemas/cursor/cursorResponse';
import type { SelectParentsRes } from '@repo/contracts/schemas/school/selectParentsResponse';
import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

const AssignParent = ({
  setIsAssignParentOpen,
  studentId,
}: {
  setIsAssignParentOpen: (value: boolean) => void;
  studentId: string;
}) => {
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);

  const schoolId = useCurrentSchoolId();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery<
    Cursor<SelectParentsRes>,
    Error,
    { pages: Cursor<SelectParentsRes>[]; pageParams: (string | null)[] },
    string[],
    string | null
  >({
    queryKey: ['school', schoolId, 'classrooms', 'select'],
    initialPageParam: null,

    queryFn: ({ pageParam }) =>
      schoolService.selectParents({
        schoolId,
        cursor: pageParam,
      }),

    getNextPageParam: (lastPage) => lastPage.meta.nextCursor,

    initialData: {
      pages: [],
      pageParams: [],
    },
  });

  const allParentList = data?.pages.flatMap((page) => page.items) ?? [];

  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: '300px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const { mutateAsync } = useMutation({
    mutationKey: ['parentStudent', studentId],
    mutationFn: (parentId: string) => parentStudentService.assignStudentToParent({ studentId, parentId, schoolId }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students', studentId], exact: false });
      queryClient.invalidateQueries({ queryKey: ['parents', selectedParentId], exact: false });
    },
  });
  const handleAssignParent = () => {
    if (!selectedParentId) return;
    try {
      mutateAsync(selectedParentId);
      toast.success('Parent assigned successfully');
      setIsAssignParentOpen(false);
    } catch {
      toast.error('Failed to assign parent');
    }
  };

  return (
    <>
      {/* ======================================================== */}
      {/* DIALOG 3: ASSIGN PARENT */}
      {/* ======================================================== */}
      <Dialog open={true} onOpenChange={setIsAssignParentOpen}>
        <DialogContent className='rounded-2xl sm:max-w-110'>
          <DialogHeader>
            <DialogTitle className='text-xl font-bold text-slate-800 dark:text-slate-100'>
              Assign Parent / Guardian
            </DialogTitle>
            <DialogDescription>Link an existing parent directory profile with this student record.</DialogDescription>
          </DialogHeader>
          <div className='space-y-4 py-6'>
            <div className='space-y-2'>
              <Label htmlFor='parent-select' className='font-semibold text-slate-700 dark:text-slate-300'>
                Select Parent to Link
              </Label>
              <Select value={selectedParentId ?? undefined} onValueChange={setSelectedParentId}>
                <SelectTrigger id='parent-select' className='rounded-xl border-slate-200 dark:border-zinc-800'>
                  <SelectValue placeholder='Choose parent profile' />
                </SelectTrigger>
                <SelectContent>
                  {allParentList.length === 0 ? (
                    <SelectItem value={'null'} disabled>
                      No unassigned parents available
                    </SelectItem>
                  ) : (
                    allParentList.map((parent) => (
                      <SelectItem key={parent.id} value={parent.id}>
                        {parent.firstName} {parent.lastName}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {selectedParentId && selectedParentId !== 'no-options' && (
              <div className='space-y-2 rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs text-slate-600 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-slate-400'>
                <div className='font-bold text-slate-700 dark:text-slate-300'>Preview Profile:</div>
                <div className='grid grid-cols-2 gap-2'>
                  <p>
                    <span className='font-semibold'>Phone:</span>{' '}
                    {allParentList.find((p) => p.id === selectedParentId)?.phone}
                  </p>
                  <p>
                    <span className='font-semibold'>CIN:</span>{' '}
                    {allParentList.find((p) => p.id === selectedParentId)?.cin}
                  </p>
                  <p className='col-span-2'>
                    <span className='font-semibold'>Email:</span>{' '}
                    {allParentList.find((p) => p.id === selectedParentId)?.email}
                  </p>
                </div>
              </div>
            )}
            {hasNextPage && <div ref={loadMoreRef} />}
            {isFetchingNextPage && (
              <div className='text-center text-sm text-slate-500 dark:text-slate-400'>Loading more...</div>
            )}
          </div>
          <DialogFooter className='gap-2 sm:gap-0'>
            <Button
              variant='outline'
              className='rounded-xl border-slate-200 dark:border-zinc-800'
              onClick={() => setIsAssignParentOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className='bg-primary text-primary-foreground hover:bg-primary/95 rounded-xl'
              onClick={handleAssignParent}
              disabled={!selectedParentId || selectedParentId === 'no-options'}
            >
              Link Parent
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AssignParent;
