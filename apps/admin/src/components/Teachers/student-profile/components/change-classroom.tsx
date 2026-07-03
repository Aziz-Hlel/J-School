import schoolService from '@/api/service/schoolService';
import { studentService } from '@/api/service/studentService';
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
import type { AssignStudentToClassroomReq } from '@repo/contracts/schemas/student/assignStudentToClassroomReq';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';

const ChangeClassrooms = ({
  setIsClassroomOpen,
  currentClassroomId,
  studentId,
}: {
  setIsClassroomOpen: (value: boolean) => void;
  currentClassroomId: string | null;
  studentId: string;
}) => {
  const schoolId = useCurrentSchoolId();
  const { data } = useQuery({
    queryKey: ['school', schoolId, 'classrooms', 'select'],
    queryFn: () => schoolService.selectClassrooms({ schoolId }),
    select: (res) => res.data,
  });

  const selectedClassrooms = data ?? [];
  const [selectedClassroomId, setSelectedClassroomId] = useState<string | null>(currentClassroomId || null);

  const { mutateAsync } = useMutation({
    mutationKey: ['student', studentId, 'classroom'],
    mutationFn: (params: { studentId: string; data: AssignStudentToClassroomReq }) =>
      studentService.assignToClassroom(schoolId, params.studentId, params.data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'], exact: false });
    },
  });

  const handleSwitchClassroom = async () => {
    if (!selectedClassroomId || selectedClassroomId === 'none') {
      return;
    }
    await mutateAsync({
      studentId,
      data: {
        classroomId: selectedClassroomId,
      },
    });
    setIsClassroomOpen(false);
  };
  return (
    <>
      {/* ======================================================== */}
      {/* DIALOG 2: SWITCH CLASSROOM */}
      {/* ======================================================== */}
      <Dialog open={true} onOpenChange={setIsClassroomOpen}>
        <DialogContent className='rounded-2xl sm:max-w-105'>
          <DialogHeader>
            <DialogTitle className='text-xl font-bold text-slate-800 dark:text-slate-100'>
              Switch Academic Classroom
            </DialogTitle>
            <DialogDescription>Select an academic grade division classroom for student allocation.</DialogDescription>
          </DialogHeader>
          <div className='space-y-4 py-6'>
            <div className='space-y-2'>
              <Label htmlFor='classroom-select' className='font-semibold text-slate-700 dark:text-slate-300'>
                Classrooms
              </Label>
              <Select value={selectedClassroomId ?? undefined} onValueChange={setSelectedClassroomId}>
                <SelectTrigger id='classroom-select' className='rounded-xl border-slate-200 dark:border-zinc-800'>
                  <SelectValue placeholder='Select a classroom' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='none'>None (Unassign Classroom)</SelectItem>
                  {selectedClassrooms.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name} ({cls.grade})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className='gap-2 sm:gap-0'>
            <Button
              variant='outline'
              className='rounded-xl border-slate-200 dark:border-zinc-800'
              onClick={() => setIsClassroomOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className='bg-primary text-primary-foreground hover:bg-primary/95 rounded-xl'
              onClick={handleSwitchClassroom}
            >
              Update Classroom
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChangeClassrooms;
