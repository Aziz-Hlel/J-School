import { classroomsService } from '@/api/service/classroomsService';
import schoolService from '@/api/service/schoolService';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useCurrentSchoolId } from '@/context/SchoolContext';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

const SelectStudents = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);

  const schoolId = useCurrentSchoolId();
  const { data } = useQuery({
    queryKey: ['school', schoolId, 'classrooms', 'select'],
    queryFn: () => schoolService.selectClassrooms({ schoolId }),
    select: (res) => res.data,
  });

  const classrooms = data ?? [];

  const [selectedClassroomId, setSelectedClassroomId] = useState<string | null>(null);

  const { data: studentsData } = useQuery({
    queryKey: ['school', schoolId, 'classrooms', selectedClassroomId, 'students'],
    queryFn: () => classroomsService.getStudents({ schoolId, classroomId: selectedClassroomId }),
    enabled: !!selectedClassroomId,
  });

  const students = studentsData ?? [];

  const handleUpdate = () => {};

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='rounded-2xl sm:max-w-105'>
        <DialogHeader>
          <DialogTitle className='text-xl font-bold text-slate-800 dark:text-slate-100'>Select Students</DialogTitle>
          <DialogDescription>Select students for the classroom.</DialogDescription>
        </DialogHeader>
        <div className='space-y-4 py-6'>
          <div className='space-y-2'>
            <Label htmlFor='classroom-select' className='font-semibold text-slate-700 dark:text-slate-300'>
              Classrooms
            </Label>
          </div>
        </div>
        <DialogFooter className='gap-2 sm:gap-0'>
          <Button
            variant='outline'
            className='rounded-xl border-slate-200 dark:border-zinc-800'
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button className='bg-primary text-primary-foreground hover:bg-primary/95 rounded-xl' onClick={handleUpdate}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SelectStudents;
