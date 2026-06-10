import { CloudUpload } from 'lucide-react';
import type { DropzoneOptions } from 'react-dropzone';
import { FileInput, FileUploader } from '@/components/ui/file-upload';
import { cn } from '@/lib/utils';

type FileUploadCompProps = {
  onFileChange: (value: File | null) => void;
  maxSizeInBytes: number;
  dropZoneConfig: DropzoneOptions;
  hasErrors: boolean;
};

export default function FileUploadComp({
  onFileChange,
  maxSizeInBytes,
  dropZoneConfig,
  hasErrors,
}: FileUploadCompProps) {
  return (
    <div className='relative flex h-full w-full flex-col justify-start'>
      <div className='mb-1 w-full text-left text-sm font-semibold'>Thumbnail</div>
      <div className='mb-4 w-full text-left text-sm font-light text-gray-600'>Select an image to upload.</div>

      <FileUploader
        value={null}
        onValueChange={onFileChange}
        maxImageSize={maxSizeInBytes}
        dropzoneOptions={dropZoneConfig}
        className='bg-background relative rounded-lg p-2'
      >
        <FileInput className={cn('outline-1 outline-slate-500 outline-dashed', hasErrors && 'outline-red-500')}>
          <div className='flex w-full flex-col items-center justify-center p-8'>
            <CloudUpload className='size-16 min-h-56 text-gray-500' />
            <p className='mb-1 text-sm text-gray-500 dark:text-gray-400'>
              <span className='font-semibold'>Click to upload</span>
              &nbsp; or drag and drop
            </p>
            <p className='text-xs text-gray-500 dark:text-gray-400'>SVG, PNG, JPG or GIF</p>
          </div>
        </FileInput>
      </FileUploader>
    </div>
  );
}
