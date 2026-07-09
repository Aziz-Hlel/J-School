import { extraCurricularService } from '@/api/service/extracurricularsService';
import { MultiFileUpload, type FileUploadItem } from '@/components/custom/MultiFileUpload';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
import queryClient from '@/config/react-qeury';
import { useCurrentSchoolId } from '@/context/SchoolContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { type CreatePostReq } from '@repo/contracts/schemas/extraCurricular/post/create';
import type { PostResponse } from '@repo/contracts/schemas/extraCurricular/post/postResponse';
import { updatePostReqSchema, type UpdatePostReq } from '@repo/contracts/schemas/extraCurricular/post/update';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useParams } from 'react-router';
import { toast } from 'sonner';

const UpdateExtraCurPost = ({ post, handleCancel }: { post: PostResponse; handleCancel: () => void }) => {
  const schoolId = useCurrentSchoolId();
  const { extraCurricularId: id } = useParams();
  const extraCurricularId = id!;
  const form = useForm<UpdatePostReq>({
    resolver: zodResolver(updatePostReqSchema),
    defaultValues: {
      content: post.content,
      mediaIds: post.media.map((m) => m.id),
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['extra-curriculars', extraCurricularId, 'posts', post.id, 'update'],
    mutationFn: extraCurricularService.post.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['extra-curriculars', extraCurricularId, 'posts'], exact: false });
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

  const defaultMedias = post.media.map((media) => ({
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
  }));

  const [uploadFiles, setUploadFiles] = useState<FileUploadItem[]>(defaultMedias);

  const setMedia = () => {
    const medias = uploadFiles
      .filter((f) => f.status === 'completed' && f.serverId)
      .map((f, i) => ({ id: f.serverId, order: i + 1 }));
    form.setValue(
      'mediaIds',
      medias.filter((m) => !!m.id).map((m) => m.id!),
      { shouldDirty: true },
    );
  };

  const onSubmit = async (data: CreatePostReq) => {
    try {
      await mutateAsync({ schoolId, data, extraCurricularId: extraCurricularId, postId: post.id });
      toast.success(`Feed updated successfully`);
    } catch {
      toast.error(`Failed to update feed`);
    }
  };
  return (
    <Dialog open={true} onOpenChange={onOpenChange}>
      <DialogContent className='scrollbar flex max-h-[calc(100dvh-4rem)] scrollbar-thumb-zinc-700 scrollbar-track-zinc-200 flex-col overflow-y-auto sm:max-w-106.25'>
        <DialogHeader>
          <DialogTitle>Update Feed</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <Controller
            name='content'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`description-input`}>Description</FieldLabel>
                <Textarea
                  {...field}
                  id={`description-input`}
                  aria-invalid={fieldState.invalid}
                  value={field.value ?? ''}
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
              {isPending ? 'Updating...' : 'Update'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateExtraCurPost;
