import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { useSelectedRow } from '../../context/selected-row-provider';

import { teacherService } from '@/api/service/teachersService';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { useCurrentSchoolId } from '@/context/SchoolContext';
import { useGetCurrentProfile } from '@/store/useAuthStore';
import {
  createTeacherCommentsReqSchema,
  type CreateTeacherCommentsReq,
} from '@repo/contracts/schemas/TeacherComments/create';
import { toast } from 'sonner';
import SelectStudents from './select-students';

const CreateDialog = () => {
  const { handleCancel, dialogState } = useSelectedRow();
  const queryClient = useQueryClient();
  const schoolId = useCurrentSchoolId();
  const currentProfile = useGetCurrentProfile();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['teacher-comment', 'update'],
    mutationFn: teacherService.createComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-comment'], exact: false });
      form.reset();
      handleCancel();
    },
  });

  const form = useForm<CreateTeacherCommentsReq>({
    resolver: zodResolver(createTeacherCommentsReqSchema),
  });

  const onSubmit: SubmitHandler<CreateTeacherCommentsReq> = async (data) => {
    try {
      await mutateAsync({ schoolId, teacherId: currentProfile!.id, payload: data });
      toast.success(`Teacher comment added successfully`);
    } catch {
      toast.error(`Failed to add teacher comment`);
    }
  };

  return (
    <Dialog onOpenChange={handleCancel} open={dialogState.openDialog === 'add'}>
      <DialogContent className='flex h-[calc(100dvh-4rem)] flex-col overflow-hidden sm:max-w-120'>
        <form onSubmit={form.handleSubmit(onSubmit)} className='flex h-full flex-col space-y-6'>
          <DialogHeader>
            <DialogTitle>Edit teacher comment</DialogTitle>
            <DialogDescription>Update the details of the teacher comment</DialogDescription>
          </DialogHeader>
          <div className='min-h-0 flex-1 scrollbar-thin scrollbar-thumb-neutral-300 scrollbar-track-transparent overflow-y-auto overscroll-contain pr-2 pb-6 hover:scrollbar-thumb-neutral-400'>
            <FieldGroup>
              {/* Title */}
              <Controller
                name='title'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='title'>Title</FieldLabel>
                    <Input {...field} id='title' aria-invalid={fieldState.invalid} placeholder='Title' />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              {/* Content */}
              <Controller
                name='content'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='content'>Content</FieldLabel>
                    <Textarea {...field} id='content' aria-invalid={fieldState.invalid} placeholder='Content' />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              {/* Can Parent Reply */}
              <Controller
                name='canParentReply'
                control={form.control}
                render={({ field }) => (
                  <Field
                    orientation='horizontal'
                    className='flex items-center justify-between rounded-lg border p-3 shadow-sm'
                  >
                    <div className='space-y-0.5'>
                      <FieldLabel htmlFor='canParentReply' className='text-sm font-medium'>
                        Can Parent Reply
                      </FieldLabel>
                      <p className='text-xs text-slate-500 dark:text-slate-400'>
                        Allow parents to comment or reply to this teacher comment.
                      </p>
                    </div>
                    <input
                      type='checkbox'
                      id='canParentReply'
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className='h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500'
                    />
                  </Field>
                )}
              />
              {/* Content */}
              <Controller
                name='studentIds'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='studentIds'>Select Students</FieldLabel>
                    <SelectStudents onSelect={field.onChange} initialSelectedStudents={[]}>
                      <Button type='button' variant={'outline'}>
                        Select Students
                      </Button>
                    </SelectStudents>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>
          </div>
          <DialogFooter className=''>
            <DialogClose asChild>
              <Button variant='outline' onClick={handleCancel}>
                Cancel
              </Button>
            </DialogClose>
            <Button type='submit' className='w-28' disabled={isPending}>
              {isPending ? <Spinner /> : <span>Save changes</span>}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDialog;
