import { MultiFileUpload } from '@/components/custom/MultiFileUpload';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { createFeedReq, type CreateFeedReq } from '@repo/contracts/schemas/Feed/create';
import { Controller, useForm } from 'react-hook-form';
import { useSelectedRow } from '../context/selected-row-provider';

const CreateFeed = () => {
  const { handleCancel, dialogState } = useSelectedRow();

  const form = useForm<CreateFeedReq>({
    resolver: zodResolver(createFeedReq),
    defaultValues: {
      title: '',
      description: '',
      media: [],
    },
  });

  const onSubmit = (data: CreateFeedReq) => {
    console.log(data);
    // TODO: implement API submission
    form.reset();
  };

  const onOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
      handleCancel();
    }
  };

  const dialogIsOpen = dialogState.openDialog === 'add';

  return (
    <Dialog open={dialogIsOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>Create Feed</Button>
      </DialogTrigger>
      <DialogContent className='scrollbar flex h-[calc(100dvh-4rem)] scrollbar-thumb-zinc-700 scrollbar-track-zinc-200 flex-col overflow-y-auto sm:max-w-106.25'>
        <DialogHeader>
          <DialogTitle>Create a New Feed</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <Controller
            name='title'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`title-input`}>Title</FieldLabel>
                <Input {...field} id={`title-input`} aria-invalid={fieldState.invalid} placeholder='Title' />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name='description'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`description-input`}>Description</FieldLabel>
                <Textarea
                  {...field}
                  id={`description-input`}
                  aria-invalid={fieldState.invalid}
                  placeholder='Description'
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <MultiFileUpload />

          <DialogFooter className='pt-4'>
            <Button type='button' variant='outline' onClick={handleCancel}>
              Cancel
            </Button>
            <Button type='submit'>Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFeed;
