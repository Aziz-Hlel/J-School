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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { useCurrentSchoolId } from '@/context/SchoolContext';
import {
  updateTeacherCommentsReqSchema,
  type UpdateTeacherCommentsReq,
} from '@repo/contracts/schemas/TeacherComments/update';
import { toast } from 'sonner';

const UpdateTeacherComment = () => {
  const { handleCancel, dialogState } = useSelectedRow();
  const queryClient = useQueryClient();
  const schoolId = useCurrentSchoolId();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['teachers', 'comments', 'update'],
    mutationFn: teacherService.updateComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers', 'comments'], exact: false });
      form.reset();
      handleCancel();
    },
  });

  const form = useForm<UpdateTeacherCommentsReq>({
    resolver: zodResolver(updateTeacherCommentsReqSchema),
    defaultValues:
      dialogState.openDialog === 'edit'
        ? {
            title: dialogState.selectedRow.title,
            content: dialogState.selectedRow.content,
            canParentReply: dialogState.selectedRow.canParentReply,
          }
        : undefined,
  });

  const isEdit = dialogState.openDialog === 'edit';
  const selectedRow = isEdit ? dialogState.selectedRow : null;
  const student = selectedRow?.student;

  const onSubmit: SubmitHandler<UpdateTeacherCommentsReq> = async (data) => {
    try {
      if (isEdit && selectedRow) {
        await mutateAsync({ schoolId, teacherId: selectedRow.teacher.id, commentId: selectedRow.id, payload: data });
      }
      toast.success(`Teacher comment updated successfully`);
    } catch {
      toast.error(`Failed to update teacher comment`);
    }
  };

  return (
    <Dialog onOpenChange={handleCancel} open={dialogState.openDialog === 'edit'}>
      <DialogContent className='flex h-[calc(100dvh-4rem)] flex-col overflow-hidden sm:max-w-120'>
        <form onSubmit={form.handleSubmit(onSubmit)} className='flex h-full flex-col space-y-6'>
          <DialogHeader>
            <DialogTitle>Edit teacher comment</DialogTitle>
            <DialogDescription>Update the details of the teacher comment</DialogDescription>
          </DialogHeader>
          <div className='min-h-0 flex-1 scrollbar-thin scrollbar-thumb-neutral-300 scrollbar-track-transparent overflow-y-auto overscroll-contain pr-2 pb-6 hover:scrollbar-thumb-neutral-400'>
            <FieldGroup>
              {/* Student Info Display */}
              {student && (
                <Card className='mb-4'>
                  <CardContent className='flex items-center gap-4 p-4'>
                    <Avatar className='size-12'>
                      <AvatarImage src={student.avatar?.url} alt={`${student.firstName.en} ${student.lastName.en}`} />
                      <AvatarFallback>
                        {student.firstName.en?.charAt(0)}
                        {student.lastName.en?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className='space-y-1'>
                      <p className='text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400'>
                        Selected Student
                      </p>
                      <div className='text-sm font-medium text-slate-800 dark:text-slate-100'>
                        <span className='font-bold'>EN:</span> {student.firstName.en} {student.lastName.en}
                      </div>
                      {student.firstName.ar && (
                        <div className='text-sm font-medium text-slate-800 dark:text-slate-100' dir='rtl'>
                          <span className='font-bold' dir='ltr'>
                            AR:
                          </span>{' '}
                          {student.firstName.ar} {student.lastName.ar}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

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
                disabled
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
                      disabled
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className='h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500'
                    />
                  </Field>
                )}
              />
            </FieldGroup>
          </div>
          <DialogFooter>
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

export default UpdateTeacherComment;
