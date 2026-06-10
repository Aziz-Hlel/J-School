import { Button } from '@/components/ui/button';
import Cropper, { type Area, type Point } from 'react-easy-crop';

type ImageCropperComProps = {
  imgUrl: string | undefined;
  crop: { x: number; y: number };
  zoom: number;
  onCropChange: (point: { x: number; y: number }) => void;
  onZoomChange: (zoom: number) => void;
  handleCancel: () => void;
  Crop_OptimizeImage: () => Promise<void>;
  onCropComplete: (_: Point, croppedAreaPixels: Area) => void;
};

export default function ImageCropperCom({
  imgUrl,
  crop,
  zoom,
  onCropChange,
  onZoomChange,
  handleCancel,
  Crop_OptimizeImage,
  onCropComplete,
}: ImageCropperComProps) {
  return (
    <div className='relative mr-auto flex h-full w-full flex-col items-center justify-center'>
      <div className='mb-1 w-full text-left text-sm font-semibold'>Thumbnail</div>
      <div className='mb-4 w-full text-left text-sm font-light text-gray-600'>Crop Image to 9:16</div>

      <div className='h-full w-full rounded-lg border border-dashed border-black p-2'>
        <div className='relative h-68 w-full'>
          <div className='bg-white'>
            <Cropper
              image={imgUrl}
              crop={crop}
              zoom={zoom}
              aspect={9 / 16}
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
            onChange={(e) => onZoomChange(e.target.valueAsNumber)}
            className='w-full'
          />
        </div>
        <div className='mr-auto flex w-full justify-end gap-4'>
          <Button onClick={handleCancel} variant='outline' className='cursor-pointer'>
            Cancel
          </Button>
          <Button onClick={async () => await Crop_OptimizeImage()} variant='default' className='cursor-pointer'>
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
}
