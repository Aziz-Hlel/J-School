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
import { Controller, useForm, useWatch, type SubmitHandler } from 'react-hook-form';
import { useSelectedRow } from '../../context/selected-row-provider';

import { homeworkService } from '@/api/service/homeworkService';
import { MultiFileUpload2, type FileUploadItem } from '@/components/custom/MultiFileUpload2';
import SelectForm from '@/components/custom/SelectForm/SelectForm';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { useCurrentSchoolId } from '@/context/SchoolContext';
import { createHomeworkReqSchema, type CreateHomeworkReq } from '@repo/contracts/schemas/Homework/create';
import { FileText, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import SelectAsignmentStudents from './select-asignment-students';

const homeworkTypes = {
  STANDARD: 'Standard',
  AI: 'AI Assistant',
};

const CreateDialog = () => {
  const { handleCancel, dialogState } = useSelectedRow();
  const queryClient = useQueryClient();
  const schoolId = useCurrentSchoolId();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['homework', 'create'],
    mutationFn: homeworkService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homework'], exact: false });
      form.reset();
      handleCancel();
    },
  });

  const form = useForm<CreateHomeworkReq>({
    resolver: zodResolver(createHomeworkReqSchema),
    defaultValues: {
      type: 'STANDARD',
      title: '',
      content: '',
      files: [],
      details: [],
    },
  });

  const selectedType = useWatch({
    control: form.control,
    name: 'type',
  });

  const onOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
      handleCancel();
    }
  };

  const onSubmit: SubmitHandler<CreateHomeworkReq> = async (data) => {
    try {
      await mutateAsync({ homework: data, schoolId });
      toast.success(`Homework created successfully`);
    } catch {
      toast.error(`Failed to create homework`);
    }
  };

  const dialogIsOpen = dialogState.openDialog === 'add';

  const [uploadFiles, setUploadFiles] = useState<FileUploadItem[]>([]);

  return (
    <Dialog onOpenChange={onOpenChange} open={dialogIsOpen}>
      <DialogContent className='flex h-[calc(100dvh-4rem)] flex-col overflow-hidden sm:max-w-140'>
        <form onSubmit={form.handleSubmit(onSubmit)} className='flex h-full flex-col space-y-6'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              {selectedType === 'AI' ? (
                <>
                  <Sparkles className='h-5 w-5 animate-pulse text-purple-500' />
                  <span>Create AI Homework</span>
                </>
              ) : (
                <>
                  <FileText className='h-5 w-5 text-blue-500' />
                  <span>Create Homework</span>
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {selectedType === 'AI'
                ? 'Generate interactive homework, quizzes, or structured reading material using AI.'
                : 'Create standard homework with instructions, exercises, and attachments.'}
            </DialogDescription>
          </DialogHeader>

          <div className='min-h-0 flex-1 scrollbar-thin scrollbar-thumb-neutral-300 scrollbar-track-transparent overflow-y-auto overscroll-contain pr-2 pb-6 hover:scrollbar-thumb-neutral-400'>
            <FieldGroup className='gap-6'>
              {/* Form Type Selection */}
              <Controller
                name='type'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='type'>Homework Type</FieldLabel>
                    <SelectForm
                      field={field}
                      options={homeworkTypes}
                      placeholder='Select Homework Type'
                      label='Homework Type'
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              {/* Conditionally Rendered Title Field */}
              <Controller
                name='title'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='title'>{selectedType === 'AI' ? 'AI Topic / Title' : 'Title'}</FieldLabel>
                    <Input
                      {...field}
                      value={field.value ?? undefined}
                      id='title'
                      aria-invalid={fieldState.invalid}
                      placeholder={'e.g., Algebra Homework: Solve Exercises on Page 45'}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              {/* Conditionally Rendered Content Area */}
              <Controller
                name='content'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='content'>Instructions / Content</FieldLabel>
                    <Textarea
                      {...field}
                      value={field.value ?? undefined}
                      id='content'
                      className='min-h-32 resize-none'
                      aria-invalid={fieldState.invalid}
                      placeholder={'Write instructions, details, homework questions, or reading material here...'}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              {/* Beautiful AI Extra Helper UI */}
              {selectedType === 'AI' && (
                <div className='rounded-lg border border-purple-100 bg-purple-50/50 p-4 dark:border-purple-900/30 dark:bg-purple-950/20'>
                  <div className='flex gap-2.5'>
                    <Sparkles className='mt-0.5 h-5 w-5 shrink-0 text-purple-600 dark:text-purple-400' />
                    <div>
                      <h4 className='text-sm font-semibold text-purple-900 dark:text-purple-300'>AI Assistant Tips</h4>
                      <p className='mt-1 text-xs leading-relaxed text-purple-700/85 dark:text-purple-400/80'>
                        Be as specific as possible in your prompt to get high-quality content. You can define the
                        structure (e.g., matching questions, multiple choice, fill in the blanks) and state the grading
                        criteria.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <Controller
                name='files'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='content'>Attachments</FieldLabel>
                    <MultiFileUpload2
                      uploadFiles={uploadFiles}
                      setUploadFiles={setUploadFiles}
                      maxFiles={10}
                      OnChange={field.onChange}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name='details'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='content'>Asignments</FieldLabel>
                    <SelectAsignmentStudents onChange={field.onChange}>
                      <Button>Select Students/Subjects</Button>
                    </SelectAsignmentStudents>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
            <Button
              type='submit'
              className={`w-fit px-2 ${selectedType === 'AI' ? 'bg-purple-600 text-white hover:bg-purple-700' : ''}`}
              disabled={isPending}
            >
              {isPending ? (
                <Spinner />
              ) : (
                <span className='flex items-center gap-1.5'>
                  {selectedType === 'AI' && <Sparkles className='h-4 w-4' />}
                  Create Homework
                </span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDialog;
