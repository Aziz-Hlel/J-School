import { Button } from '@/components/ui/button';
import { FileInput, FileUploader } from '@/components/ui/file-upload';
import { cn } from '@/lib/utils';
import type { DropzoneOptions } from 'react-dropzone';

type ImageDisplayedCompProps = {
  img: string | null;
  maxSizeInBytes: number;
  dropZoneConfig: DropzoneOptions;
  onFileChange: (value: File | null) => void;
  rollBackToInitImage: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  hasErrors: boolean;
};

export default function ImageDisplayedComp({
  img,
  maxSizeInBytes,
  dropZoneConfig,
  onFileChange,
  rollBackToInitImage,
  hasErrors,
}: ImageDisplayedCompProps) {
  return (
    <div className='relative flex h-full w-full flex-col justify-start'>
      <div className={cn('mb-1 w-full text-left text-sm font-semibold', hasErrors && 'text-red-500')}>Thumbnail</div>
      <div className='mb-4 w-full text-left text-sm font-light text-gray-600'>Uploaded Image</div>

      <div
        className={cn('h-full w-full rounded-lg border border-dashed border-black p-2', hasErrors && 'border-red-500')}
      >
        <img src={img ?? undefined} className='mx-auto h-72 rounded-lg object-contain' />

        <div className='flex justify-end gap-4 px-4 pt-4'>
          <Button onClick={rollBackToInitImage} type='button' variant='outline' className='cursor-pointer'>
            Cancel
          </Button>
          <FileUploader
            value={null}
            onValueChange={onFileChange}
            maxImageSize={maxSizeInBytes}
            dropzoneOptions={dropZoneConfig}
            className='w-fit'
          >
            <FileInput>
              <Button type='button' variant='default' className='cursor-pointer'>
                Change
              </Button>
            </FileInput>
          </FileUploader>
        </div>
      </div>
    </div>
  );
}
