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
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useSelectedRow } from '../context/selected-row-provider';

const CreateFeed = () => {
  const { t } = useTranslation(['feed']);
  const { handleCancel, dialogState } = useSelectedRow();
  const schoolId = useCurrentSchoolId();

  const form = useForm<CreateFeedReq>({
    resolver: zodResolver(createFeedReq),
    defaultValues: {
      title: '',
      description: '',
      media: [],
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['feed', 'create'],
    mutationFn: feedService.create,
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

  const dialogIsOpen = dialogState.openDialog === 'add';

  const [uploadFiles, setUploadFiles] = useState<FileUploadItem[]>([]);

  const setMedia = () => {
    const medias = uploadFiles
      .filter((f) => f.status === 'completed' && f.serverId)
      .map((f, i) => ({ id: f.serverId, order: i + 1 }));
    form.setValue('media', medias, { shouldDirty: true });
  };

  const onSubmit = async (data: CreateFeedReq) => {
    try {
      await mutateAsync({ schoolId, data });
      toast.success(t('createModal.toast.success'));
    } catch {
      toast.error(t('createModal.toast.error'));
    }
  };

  return (
    <Dialog open={dialogIsOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>{t('createModal.trigger')}</Button>
      </DialogTrigger>
      <DialogContent className='scrollbar flex max-h-[calc(100dvh-4rem)] scrollbar-thumb-zinc-700 scrollbar-track-zinc-200 flex-col overflow-y-auto sm:max-w-106.25'>
        <DialogHeader>
          <DialogTitle>{t('createModal.title')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <Controller
            name='title'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor='title-input'>{t('createModal.fields.title')}</FieldLabel>
                <Input
                  {...field}
                  id='title-input'
                  aria-invalid={fieldState.invalid}
                  placeholder={t('createModal.fields.titlePlaceholder')}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name='description'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor='description-input'>{t('createModal.fields.description')}</FieldLabel>
                <Textarea
                  {...field}
                  id='description-input'
                  aria-invalid={fieldState.invalid}
                  placeholder={t('createModal.fields.descriptionPlaceholder')}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <MultiFileUpload uploadFiles={uploadFiles} setUploadFiles={setUploadFiles} maxFiles={10} />

          <DialogFooter className='pt-4'>
            <Button type='button' variant='outline' onClick={handleCancel}>
              {t('createModal.actions.cancel')}
            </Button>
            <Button type='submit' onClickCapture={setMedia} disabled={isPending}>
              {isPending ? t('createModal.actions.submitting') : t('createModal.actions.submit')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFeed;
