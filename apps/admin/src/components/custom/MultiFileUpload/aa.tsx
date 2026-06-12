'use client';

import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import {
  CircleAlertIcon,
  FileArchiveIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  HeadphonesIcon,
  ImageIcon,
  RefreshCwIcon,
  UploadIcon,
  VideoIcon,
  XIcon,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { storageApi } from '@/api/storage/storage.repository';
import { MediaCategory, MediaPurpose, type GetPresignedUrlResponse } from '@/api/storage/storage.types';
import { cn } from '@/lib/utils';
import { optimizeImage } from '@/utils/image-processor';
import { formatBytes, useFileUpload, type FileMetadata, type FileWithPreview } from '@/hooks/use-file-upload';
import { Button } from '@/components/ui/button';
import { Alert, AlertAction, AlertDescription, AlertTitle } from './ui/alert';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

interface FileUploadItem extends FileWithPreview {
  progress: number;
  status: 'idle' | 'uploading' | 'completed' | 'error';
  error?: string;
}

interface ProgressUploadProps {
  maxFiles?: number;
  maxSize?: number;
  accept?: string;
  multiple?: boolean;
  className?: string;
  onFilesChange?: (files: FileWithPreview[]) => void;
  onUploadSuccess?: (media: GetPresignedUrlResponse['media']) => void;
  onUploadError?: (error: string) => void;
  compact?: boolean;
  initialFiles?: FileMetadata[];
  uploadOn?: 'select' | 'submit';
  purpose?: MediaPurpose;
  category?: MediaCategory;
}

export const CustomFileUpload = forwardRef<{ startUpload: () => Promise<void> }, ProgressUploadProps>(
  function CustomFileUpload(
    {
      maxFiles = 5,
      maxSize = 10 * 1024 * 1024, // 10MB
      accept = '*',
      multiple = true,
      className,
      onFilesChange,
      onUploadSuccess,
      onUploadError,
      compact,
      initialFiles,
      uploadOn = 'select',
      purpose = MediaPurpose.DOCUMENT,
      category = MediaCategory.DOCUMENT,
    }: ProgressUploadProps,
    ref,
  ) {
    const { t } = useTranslation(['common']);
    // Create default images using FileMetadata type
    const defaultImages: FileMetadata[] = initialFiles || [];

    // Convert default images to FileUploadItem format
    const defaultUploadFiles: FileUploadItem[] = defaultImages.map((image) => ({
      id: image.id,
      file: {
        name: image.name,
        size: image.size,
        type: image.type,
      } as File,
      preview: image.url,
      progress: 100,
      status: 'completed' as const,
    }));

    const [uploadFiles, setUploadFiles] = useState<FileUploadItem[]>(defaultUploadFiles);

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
      multiple,
      initialFiles: defaultImages,
      onFilesChange: (newFiles) => {
        // Convert to upload items when files change, preserving existing status
        const newUploadFiles: FileUploadItem[] = newFiles.map((file) => {
          // Check if this file already exists in uploadFiles
          const existingFile = uploadFiles.find((existing) => existing.id === file.id);

          if (existingFile) {
            // Preserve existing file status and progress
            return {
              ...existingFile,
              ...file, // Update any changed properties from the file
            };
          } else {
            // New file
            return {
              ...file,
              progress: 0,
              status: 'idle' as const,
            };
          }
        });
        setUploadFiles(newUploadFiles);
        onFilesChange?.(newFiles);
      },
    });

    const performUpload = async (fileItem: FileUploadItem) => {
      if (fileItem.status === 'completed' || !(fileItem.file instanceof File)) return;

      setUploadFiles((prev) =>
        prev.map((f) => (f.id === fileItem.id ? { ...f, status: 'uploading', progress: 0 } : f)),
      );

      try {
        //* here we optimize image if it is an image

        const fileToUpload = fileItem.file.type.startsWith('image/')
          ? await optimizeImage(fileItem.file, 4096, 4096)
          : fileItem.file;

        const presignedData = await storageApi.getPresignedUrl({
          purpose,
          originalName: fileToUpload.name,
          extension: fileToUpload.name.split('.').pop() || '',
          mimeType: fileToUpload.type,
          contentLength: fileToUpload.size,
          category,
        });

        await storageApi.upload({ uploadUrl: presignedData.uploadUrl, file: fileToUpload }, (progress) => {
          setUploadFiles((prev) => prev.map((f) => (f.id === fileItem.id ? { ...f, progress } : f)));
        });

        setUploadFiles((prev) =>
          prev.map((f) => (f.id === fileItem.id ? { ...f, status: 'completed', progress: 100 } : f)),
        );

        onUploadSuccess?.(presignedData.media);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Upload failed';
        setUploadFiles((prev) =>
          prev.map((f) => (f.id === fileItem.id ? { ...f, status: 'error', error: errorMessage } : f)),
        );
        onUploadError?.(errorMessage);
      }
    };

    // Handle immediate upload if uploadOn is 'select'
    useEffect(() => {
      if (uploadOn === 'select') {
        const idleFiles = uploadFiles.filter((f) => f.status === 'idle');
        idleFiles.forEach((fileItem) => {
          performUpload(fileItem);
        });
      }
    }, [uploadFiles, uploadOn]);

    const retryUpload = (fileId: string) => {
      const fileItem = uploadFiles.find((f) => f.id === fileId);
      if (fileItem) {
        performUpload(fileItem);
      }
    };

    const startUpload = async () => {
      const filesToUpload = uploadFiles.filter((f) => f.status === 'idle' || f.status === 'error');
      await Promise.all(filesToUpload.map((fileItem) => performUpload(fileItem)));
    };

    useImperativeHandle(ref, () => ({ startUpload }));

    const removeUploadFile = (fileId: string) => {
      setUploadFiles((prev) => prev.filter((file) => file.id !== fileId));
      removeFile(fileId);
    };

    const getFileIcon = (file: File | FileMetadata) => {
      const type = file instanceof File ? file.type : file.type;
      if (type.startsWith('image/')) return <ImageIcon className='size-4' />;
      if (type.startsWith('video/')) return <VideoIcon className='size-4' />;
      if (type.startsWith('audio/')) return <HeadphonesIcon className='size-4' />;
      if (type.includes('pdf')) return <FileTextIcon className='size-4' />;
      if (type.includes('word') || type.includes('doc')) return <FileTextIcon className='size-4' />;
      if (type.includes('excel') || type.includes('sheet')) return <FileSpreadsheetIcon className='size-4' />;
      if (type.includes('zip') || type.includes('rar')) return <FileArchiveIcon className='size-4' />;
      return <FileTextIcon className='size-4' />;
    };

    const completedCount = uploadFiles.filter((f) => f.status === 'completed').length;
    const errorCount = uploadFiles.filter((f) => f.status === 'error').length;
    const uploadingCount = uploadFiles.filter((f) => f.status === 'uploading').length;

    return (
      <div className={cn('w-full max-w-2xl', className)}>
        {/* Upload Area */}
        {compact ? (
          <div
            className={cn(
              'flex items-center gap-3 rounded-lg border px-3 py-2 transition-colors',
              isDragging ? 'border-primary bg-primary/5' : 'border-border',
            )}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input {...getInputProps()} className='sr-only' />
            <UploadIcon className={cn('h-4 w-4 shrink-0', isDragging ? 'text-primary' : 'text-muted-foreground')} />
            <p className='text-muted-foreground flex-1 truncate text-sm'>
              {isDragging ? t('media.upload_area.compact.dragging_hint') : t('media.upload_area.compact.drop_hint')}
            </p>
            <Button type='button' onClick={openFileDialog} variant='outline' size='sm'>
              {t('media.upload_area.compact.browse_button')}
            </Button>
          </div>
        ) : (
          <div
            className={cn(
              'relative rounded-lg border border-dashed p-8 text-center transition-colors',
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-muted-foreground/50',
            )}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input {...getInputProps()} className='sr-only' />
            <div className='flex flex-col items-center gap-4'>
              <div
                className={cn(
                  'flex h-16 w-16 items-center justify-center rounded-full',
                  isDragging ? 'bg-primary/10' : 'bg-muted',
                )}
              >
                <UploadIcon className={cn('h-6', isDragging ? 'text-primary' : 'text-muted-foreground')} />
              </div>
              <div className='space-y-2'>
                <h3 className='text-lg font-semibold'>{t('media.upload_area.full.title')}</h3>
                <p className='text-muted-foreground text-sm'>{t('media.upload_area.full.drag_drop_hint')}</p>
                <p className='text-muted-foreground text-xs'>
                  {t('media.upload_area.full.support_hint', {
                    maxSize: formatBytes(maxSize),
                  })}
                </p>
              </div>
              <Button type='button' onClick={openFileDialog}>
                <UploadIcon className='h-4 w-4' />
                {t('media.upload_area.full.select_button')}
              </Button>
            </div>
          </div>
        )}

        {/* Upload Stats */}
        {uploadFiles.length > 0 && (
          <div className='mt-6 flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <h4 className='text-sm font-medium'>{t('media.upload_stats.title')}</h4>
              <div className='flex items-center gap-2'>
                {completedCount > 0 && <Badge>{t('media.upload_stats.completed', { count: completedCount })}</Badge>}
                {errorCount > 0 && (
                  <Badge variant='destructive'>{t('media.upload_stats.failed', { count: errorCount })}</Badge>
                )}
                {uploadingCount > 0 && (
                  <Badge variant='secondary'>{t('media.upload_stats.uploading', { count: uploadingCount })}</Badge>
                )}
              </div>
            </div>

            <Button type='button' onClick={clearFiles} variant='outline' size='sm'>
              {t('media.upload_stats.clear_all')}
            </Button>
          </div>
        )}

        {/* File List */}
        {uploadFiles.length > 0 && (
          <div className='mt-4 space-y-3'>
            {uploadFiles.map((fileItem: FileUploadItem) => (
              <div key={fileItem.id} className='border-border bg-card rounded-lg border p-2.5'>
                <div className='flex items-start gap-2.5'>
                  {/* File Icon */}
                  <div className='shrink-0'>
                    {fileItem.preview && fileItem.file.type.startsWith('image/') ? (
                      <img
                        src={fileItem.preview}
                        alt={fileItem.file.name}
                        className='h-12 w-12 rounded-lg border object-cover'
                      />
                    ) : (
                      <div className='border-border text-muted-foreground flex h-12 w-12 items-center justify-center rounded-lg border'>
                        {getFileIcon(fileItem.file)}
                      </div>
                    )}
                  </div>

                  {/* File Info */}
                  <div className='min-w-0 flex-1'>
                    <div className='mt-0.75 flex items-center justify-between'>
                      <div className='inline-flex flex-col justify-center gap-1 truncate font-medium'>
                        <span className='text-sm'>{fileItem.file.name}</span>
                        <span className='text-muted-foreground text-xs'>{formatBytes(fileItem.file.size)}</span>
                      </div>
                      <div className='flex items-center gap-2'>
                        {/* Remove Button */}
                        <Button
                          type='button'
                          onClick={() => removeUploadFile(fileItem.id)}
                          variant='ghost'
                          size='icon'
                          className='text-muted-foreground size-6 hover:bg-transparent hover:opacity-100'
                        >
                          <XIcon className='size-4' />
                        </Button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {fileItem.status === 'uploading' && (
                      <div className='mt-2'>
                        <Progress value={fileItem.progress} className='h-1' />
                      </div>
                    )}

                    {/* Error Message */}
                    {fileItem.status === 'error' && fileItem.error && (
                      <Alert variant='destructive' className='mt-2 px-2 py-1'>
                        <CircleAlertIcon className='size-4' />
                        <AlertTitle className='text-xs'>{fileItem.error}</AlertTitle>
                        <AlertAction>
                          <Button
                            type='button'
                            onClick={() => retryUpload(fileItem.id)}
                            variant='ghost'
                            size='icon'
                            className='text-muted-foreground size-6 hover:bg-transparent hover:opacity-100'
                          >
                            <RefreshCwIcon className='size-3.5' />
                          </Button>
                        </AlertAction>
                      </Alert>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error Messages */}
        {errors.length > 0 && (
          <Alert variant='destructive' className='mt-5'>
            <CircleAlertIcon />
            <AlertTitle>{t('media.upload_area.errors.title')}</AlertTitle>
            <AlertDescription>
              {errors.map((error, index) => (
                <p key={index} className='last:mb-0'>
                  {error}
                </p>
              ))}
            </AlertDescription>
          </Alert>
        )}
      </div>
    );
  },
);
