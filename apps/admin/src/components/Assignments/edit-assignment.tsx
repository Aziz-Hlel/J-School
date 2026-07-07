import { assignmentService } from '@/api/service/assignmentService';
import schoolService from '@/api/service/schoolService';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import queryClient from '@/config/react-qeury';
import { useCurrentSchoolId } from '@/context/SchoolContext';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  assignTeacherRequestSchema,
  type AssignTeacherRequestInput,
} from '@repo/contracts/schemas/assignment/assignTeacherRequest';
import type { ClassroomSubjectsWithTeachersResponse } from '@repo/contracts/schemas/classroom/management/ClassroomSubjectsWithTeachers';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Clock, GraduationCap, Layers } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const DOMAIN_COLORS: Record<string, string> = {
  Sciences: '#3b82f6',
  Mathematics: '#8b5cf6',
  Languages: '#10b981',
  Arts: '#f59e0b',
  History: '#ef4444',
  Geography: '#06b6d4',
};

function domainColor(domain: string) {
  return DOMAIN_COLORS[domain] ?? '#6b7280';
}

const EditAssignment = ({
  subject,
  isEditOpen,
  setIsEditOpen,
  classroomId,
}: {
  subject: ClassroomSubjectsWithTeachersResponse;
  isEditOpen: boolean;
  setIsEditOpen: (value: boolean) => void;
  classroomId: string;
}) => {
  const schoolId = useCurrentSchoolId();
  const accent = domainColor(subject.domain);

  const { data: teachersSelectData } = useQuery({
    queryKey: ['teachers', 'select'],
    queryFn: () => schoolService.selectTeachers({ schoolId }),
  });
  const teachersSelect = teachersSelectData?.items ?? [];

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['attendances', classroomId, 'subjects', 'update'],
    mutationFn: (payload: AssignTeacherRequestInput) =>
      assignmentService.assignTeacher(schoolId, subject.assignmentId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendances'], exact: false });
      setIsEditOpen(false);
    },
  });

  const form = useForm<AssignTeacherRequestInput>({
    resolver: zodResolver(assignTeacherRequestSchema),
    defaultValues: {
      teacherId: subject.teacher?.id ?? null,
    },
  });

  const handleUpdate = async (data: AssignTeacherRequestInput) => {
    try {
      await mutateAsync(data);
      toast.success('Assignment updated');
    } catch {
      toast.error('Failed to update assignment');
    }
  };

  return (
    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
      <DialogContent className='gap-0 overflow-hidden p-0 sm:max-w-md'>
        {/* Accent strip */}
        <div className='h-1 w-full' style={{ backgroundColor: accent }} />

        <div className='p-6'>
          <DialogHeader className='mb-5'>
            <DialogTitle className='text-base'>Assign teacher</DialogTitle>
            <p className='text-muted-foreground text-sm'>
              Update the teacher for <span className='text-foreground font-medium'>{subject.name.en}</span>
            </p>
          </DialogHeader>

          {/* Subject meta chips */}
          <div className='mb-5 flex flex-wrap gap-2'>
            <span
              className='inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium'
              style={{ backgroundColor: `${accent}18`, color: accent }}
            >
              <Layers className='h-3 w-3' />
              {subject.domain}
            </span>
            <span className='bg-muted text-muted-foreground inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium'>
              <GraduationCap className='h-3 w-3' />
              {subject.grade}
            </span>
            <span className='bg-muted text-muted-foreground inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium'>
              <Clock className='h-3 w-3' />
              {subject.hoursPerWeek}h / week
            </span>
          </div>

          <Separator className='mb-5' />

          <form onSubmit={form.handleSubmit(handleUpdate)}>
            <Field>
              <FieldLabel className='text-sm font-medium'>Teacher</FieldLabel>
              <Select
                name='teacherId'
                value={form.watch('teacherId') ?? undefined}
                onValueChange={(value) => form.setValue('teacherId', value === undefined ? null : value)}
              >
                <SelectTrigger className='mt-1.5'>
                  <SelectValue placeholder='Select a teacher…' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={undefined}>
                    <span className='text-muted-foreground'>No teacher</span>
                  </SelectItem>
                  {teachersSelect.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.firstName} {teacher.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.teacherId?.message && (
                <FieldError>{form.formState.errors.teacherId.message}</FieldError>
              )}
            </Field>
          </form>
        </div>

        <DialogFooter className='bg-muted/40 border-t px-6 py-4'>
          <Button type='button' variant='ghost' size='sm' onClick={() => setIsEditOpen(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button type='submit' size='sm' disabled={isPending} onClick={form.handleSubmit(handleUpdate)}>
            {isPending ? 'Saving…' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditAssignment;
