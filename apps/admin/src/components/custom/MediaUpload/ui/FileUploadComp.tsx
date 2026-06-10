import { CloudUpload } from 'lucide-react';
import type { DropzoneOptions } from 'react-dropzone';
import { FileInput, FileUploader } from '@/components/ui/file-upload';
import { cn } from '@/lib/utils';
import { useFile } from '../context/fileProvider';

type FileUploadCompProps = {
  maxSizeInBytes: number;
  dropZoneConfig: DropzoneOptions;
  hasErrors: boolean;
};

export default function FileUploadComp({ maxSizeInBytes, dropZoneConfig, hasErrors }: FileUploadCompProps) {
  const { handleFileChange } = useFile();
  return (
    <div className='relative flex h-full w-full flex-col justify-start'>
      <FileUploader
        value={null}
        onValueChange={handleFileChange}
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
