'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/reui/alert';
import { Badge } from '@/components/reui/badge';
import { formatBytes, useFileUpload, type FileMetadata, type FileWithPreview } from '@/hooks/use-file-upload';
import { useEffect, useState } from 'react';

import { Sortable, SortableItem, SortableItemHandle } from '@/components/reui/sortable';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CircleAlertIcon, GripVerticalIcon, UploadIcon, XIcon } from 'lucide-react';
import CircularProgressBar from '../ImageUpload/CircularProgressBar ';
import { uploadImage } from './getSignedUrlUpload';

export interface FileUploadItem extends FileWithPreview {
  id: string;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
  serverId?: string;
  preview: string;
}

interface ProgressUploadProps {
  maxFiles?: number;
  maxSize?: number;
  accept?: string;
  className?: string;
  uploadFiles: FileUploadItem[];
  setUploadFiles: React.Dispatch<React.SetStateAction<FileUploadItem[]>>;
  OnChange: (studentIds: string[]) => void;
}

export function MultiFileUpload2({
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024, // 10MB
  accept = '*',
  className,
  uploadFiles,
  setUploadFiles,
  OnChange,
}: ProgressUploadProps) {
  const [filesProgress, setFilesProgress] = useState<Record<string, number>>({});

  const handleUpdateFormValue = (newItems: FileUploadItem[]) => {
    const medias = newItems.filter((f) => f.status === 'completed' && f.serverId).map((f) => f.serverId!);
    OnChange(medias);
  };

  const handleSortChange = (newItems: FileUploadItem[]) => {
    setUploadFiles(newItems);
  };

  const initMedia: FileMetadata[] = uploadFiles.map((file) => ({
    id: file.id,
    name: file.file.name,
    size: file.file.size,
    type: file.file.type,
    url: file.preview,
    preview: file.preview,
  }));

  const [
    { isDragging, errors },
    {
      removeFile,
      clearFiles,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      getInputProps,
    },
  ] = useFileUpload({
    maxFiles,
    maxSize,
    accept,
    multiple: true,
    initialFiles: initMedia,
    onFilesChange: async (newFiles) => {
      // Convert to upload items when files change, preserving existing status
      const newUploadFiles = newFiles.map((file) => {
        // Check if this file already exists in uploadFiles
        const existingFile = uploadFiles.find((existing) => existing.id === file.id);

        if (existingFile) {
          // Preserve existing file status and progress
          return {
            ...existingFile,
            ...file, // Update any changed properties from the file
          };
        } else {
          // New file - set to uploading
          return {
            ...file,
            progress: 0,
            status: 'uploading' as const,
          };
        }
      });
      const newOptimizedFiles = newUploadFiles;
      // const newOptimizedFiles = await Promise.all(
      //   newUploadFiles.map(async (file) => {
      //     const optimizedImg = await prepareImageForUpload(file, file.file.name);
      //     return { ...file, file: optimizedImg };
      //   }),
      // );

      setUploadFiles(newOptimizedFiles);
    },
  });

  // Simulate upload progress
  useEffect(() => {
    uploadFiles
      .filter((f) => f.status === 'uploading')
      .forEach(async (file) => {
        if (!(file.file instanceof File)) return;
        if (filesProgress[file.id]) return;
        setFilesProgress((prev) => ({ ...prev, [file.id]: 10 }));
        const { id } = await uploadImage({
          uploadedImg: file.file,
          name: file.file.name,
          setProgress: (progress) => {
            setFilesProgress((prev) => ({ ...prev, [file.id]: progress }));
          },
        });
        setUploadFiles((prev) => prev.map((f) => (f.id === file.id ? { ...f, status: 'completed', serverId: id } : f)));
      });
  }, [uploadFiles, filesProgress, setUploadFiles]);

  useEffect(() => {
    handleUpdateFormValue(uploadFiles);
  }, [handleUpdateFormValue, uploadFiles]);

  // const retryUpload = (fileId: string) => {
  //   setUploadFiles((prev) =>
  //     prev.map((file) =>
  //       file.id === fileId
  //         ? {
  //             ...file,
  //             progress: 0,
  //             status: 'uploading' as const,
  //             error: undefined,
  //           }
  //         : file,
  //     ),
  //   );
  // };

  const removeUploadFile = (fileId: string) => {
    console.log('id to be removed : ', fileId);
    setUploadFiles((prev) => prev.filter((file) => file.id !== fileId));
    removeFile(fileId);
  };

  const completedCount = uploadFiles.filter((f) => f.status === 'completed').length;
  const errorCount = uploadFiles.filter((f) => f.status === 'error').length;
  const uploadingCount = uploadFiles.filter((f) => f.status === 'uploading').length;

  return (
    <div className={cn('w-full max-w-2xl', className)}>
      {/* Upload Area */}

      <div
        className={cn(
          'relative flex items-center justify-between rounded-lg border p-4 transition-colors',
          isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground/30',
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input {...getInputProps()} className='sr-only' />

        <div className='flex items-center gap-3'>
          <UploadIcon className='text-muted-foreground/80 h-4 w-4' />
          <span className='text-muted-foreground text-sm font-normal'>Drop files here or browse</span>
        </div>

        <Button
          type='button'
          variant='outline'
          size='lg'
          className='border-border bg-background hover:bg-accent hover:text-accent-foreground h-10 rounded-lg border px-4 text-sm font-medium shadow-xs'
          onClick={openFileDialog}
        >
          Browse files
        </Button>
      </div>

      {/* Instructions */}
      <div className='mt-4 text-center'>
        <p className='text-muted-foreground text-xs'>
          Upload up to {maxFiles} images (JPG, PNG, GIF, WebP, max {formatBytes(maxSize)} each). <br />
          Drag and drop images to reorder.
          {uploadFiles.length > 0 && ` ${uploadFiles.length}/${maxFiles} uploaded.`}
        </p>
      </div>
      {/* Upload Stats */}

      {uploadFiles.length > 0 && (
        <div className='mt-6 flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <h4 className='text-sm font-medium'>Upload Progress</h4>
            <div className='flex items-center gap-2'>
              {completedCount > 0 && (
                <Badge size='sm' variant='success-light'>
                  Completed: {completedCount}
                </Badge>
              )}
              {errorCount > 0 && (
                <Badge size='sm' variant='destructive'>
                  Failed: {errorCount}
                </Badge>
              )}
              {uploadingCount > 0 && (
                <Badge size='sm' variant='secondary'>
                  Uploading: {uploadingCount}
                </Badge>
              )}
            </div>
          </div>

          <Button onClick={clearFiles} variant='outline' size='sm'>
            Clear all
          </Button>
        </div>
      )}

      {/* Error Messages */}
      {errors.length > 0 && (
        <Alert variant='destructive' className='mt-5'>
          <CircleAlertIcon />
          <AlertTitle>File upload error(s)</AlertTitle>
          <AlertDescription>
            {errors.map((error, index) => (
              <p key={index} className='last:mb-0'>
                {error}
              </p>
            ))}
          </AlertDescription>
        </Alert>
      )}

      {/* Image Grid with Sortable */}
      <div className='mb-6'>
        {/* Combined Images Sortable */}
        <Sortable
          value={uploadFiles}
          onValueChange={handleSortChange}
          getItemValue={(item) => item.id}
          strategy='grid'
          className='grid auto-rows-fr grid-cols-5 gap-2.5'
        >
          {uploadFiles.map((item) => (
            <SortableItem key={item.id} value={item.id}>
              <div className='bg-accent/50 group/item border-border hover:bg-accent/70 relative flex shrink-0 items-center justify-center rounded-md border shadow-none transition-all duration-200 hover:z-10 data-[dragging=true]:z-50'>
                <img
                  src={item.preview}
                  className='pointer-events-none h-30 w-full rounded-md object-cover'
                  alt={item.file.name}
                />
                {item.status === 'uploading' && (
                  <div className='absolute inset-0 flex items-center justify-center bg-black/50'>
                    <CircularProgressBar progress={filesProgress[item.id] ?? 0} />
                  </div>
                )}

                {/* Drag Handle */}
                <SortableItemHandle className='absolute inset-s-2 top-2 cursor-grab opacity-0 group-hover/item:opacity-100 active:cursor-grabbing'>
                  <Button
                    variant='outline'
                    size='icon'
                    className='size-6 rounded-full dark:bg-zinc-800 hover:dark:bg-zinc-700'
                  >
                    <GripVerticalIcon className='size-3.5' />
                  </Button>
                </SortableItemHandle>

                {/* Remove Button Overlay */}
                <Button
                  onClick={() => removeUploadFile(item.id)}
                  variant='outline'
                  size='icon'
                  className='absolute inset-e-2 top-2 size-6 rounded-full opacity-0 shadow-sm group-hover/item:opacity-100 dark:bg-zinc-800 hover:dark:bg-zinc-700'
                >
                  <XIcon className='size-3.5' />
                </Button>
              </div>
            </SortableItem>
          ))}
        </Sortable>
      </div>
    </div>
  );
}
