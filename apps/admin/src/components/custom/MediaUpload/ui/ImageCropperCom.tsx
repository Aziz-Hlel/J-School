import { Button } from '@/components/ui/button';
import { useMemo } from 'react';
import Cropper from 'react-easy-crop';
import { useFile } from '../context/fileProvider';
import { useCrop } from '../hooks/use-crop';
import { useGetAspect } from '../hooks/use-get-aspect';

type ImageCropperComProps = {
  aspect: number | null | undefined;
};

export default function ImageCropperCom({ aspect: aspectProp }: ImageCropperComProps) {
  const { file, handleFileChange } = useFile();
  const { crop, zoom, onCropChange, onZoomChange, process_upload_File, onCropComplete } = useCrop();

  const { aspect } = useGetAspect({ aspectProp: aspectProp });

  const image = useMemo(() => (file ? URL.createObjectURL(file) : undefined), [file]);

  const handleCancel = () => handleFileChange(null);

  return (
    <div className='relative mr-auto flex h-full w-full flex-col items-center justify-center'>
      <div className='h-full w-full rounded-lg border border-dashed border-black p-2'>
        <div className='relative h-68 w-full'>
          <div className='bg-white'>
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={onCropChange}
              onCropComplete={onCropComplete}
              classes={{
                containerClassName: 'fixed  w-full h-full ',
              }}
            />
          </div>
        </div>

        <div className='mr-auto w-full'>
          <input
            type='range'
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            aria-labelledby='Zoom'
            onChange={onZoomChange}
            className='w-full'
          />
        </div>
        <div className='mr-auto flex w-full justify-end gap-4'>
          <Button onClick={handleCancel} variant='outline' className='cursor-pointer'>
            Cancel
          </Button>
          <Button onClick={process_upload_File} variant='default' className='cursor-pointer'>
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
}
