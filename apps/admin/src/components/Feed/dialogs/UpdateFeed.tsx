import { feedService } from '@/api/service/feedService';
import { MultiFileUpload, type FileUploadItem } from '@/components/custom/MultiFileUpload';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import queryClient from '@/config/react-qeury';
import { useCurrentSchoolId } from '@/context/SchoolContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { createFeedReq, type CreateFeedReq } from '@repo/contracts/schemas/Feed/create';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useSelectedRow } from '../context/selected-row-provider';

const UpdateFeed = () => {
  const { handleCancel, dialogState } = useSelectedRow();
  const schoolId = useCurrentSchoolId();

  const form = useForm<CreateFeedReq>({
    resolver: zodResolver(createFeedReq),
    defaultValues: {
      title: dialogState.openDialog === 'edit' ? dialogState.selectedRow.title : '',
      description: dialogState.openDialog === 'edit' ? dialogState.selectedRow.description : '',
      media: dialogState.openDialog === 'edit' ? dialogState.selectedRow.media : [],
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['feed', 'update'],
    mutationFn: feedService.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'], exact: false });
      form.reset();
      handleCancel();
    },
  });

  const onOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
      handleCancel();
    }
  };

  const dialogIsOpen = dialogState.openDialog === 'edit';

  const defaultMedias =
    dialogState.openDialog === 'edit'
      ? dialogState.selectedRow.media.map((media) => ({
          id: media.id,
          status: 'completed' as const,
          serverId: media.id,
          file: {
            id: media.id,
            name: '',
            size: 100,
            type: 'image/jpeg',
            url: media.url,
          },
          preview: media.url,
        }))
      : [];

  const [uploadFiles, setUploadFiles] = useState<FileUploadItem[]>(defaultMedias);

  const setMedia = () => {
    const medias = uploadFiles
      .filter((f) => f.status === 'completed' && f.serverId)
      .map((f, i) => ({ id: f.serverId, order: i + 1 }));
    form.setValue('media', medias, { shouldDirty: true });
  };

  const onSubmit = async (data: CreateFeedReq) => {
    try {
      if (dialogState.openDialog === 'edit') {
        await mutateAsync({ schoolId, data, id: dialogState.selectedRow.id });
        toast.success(`Feed updated successfully`);
      }
    } catch {
      toast.error(`Failed to update feed`);
    }
  };
  return (
    <Dialog open={dialogIsOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>Create Feed</Button>
      </DialogTrigger>
      <DialogContent className='scrollbar flex max-h-[calc(100dvh-4rem)] scrollbar-thumb-zinc-700 scrollbar-track-zinc-200 flex-col overflow-y-auto sm:max-w-106.25'>
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

          <MultiFileUpload uploadFiles={uploadFiles} setUploadFiles={setUploadFiles} maxFiles={100} />

          <DialogFooter className='pt-4'>
            <Button type='button' variant='outline' onClick={handleCancel}>
              Cancel
            </Button>
            <Button type='submit' onClickCapture={setMedia} disabled={isPending}>
              {isPending ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateFeed;
