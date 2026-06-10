import { useState, type ChangeEvent } from 'react';
import type { Area, Point } from 'react-easy-crop';
import { toast } from 'sonner';
import { useFile } from '../context/fileProvider';
import getCroppedImg from '../helper/cropImg.func';
import compressImage from '../helper/processImage';

export const useCrop = () => {
  const { file, handleRollBack, upload_media } = useFile();

  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onZoomChange = (e: ChangeEvent<HTMLInputElement>) => setZoom(e.target.valueAsNumber);
  const onCropChange = (point: Point) => setCrop(point);
  const onCropComplete = (_: Point, croppedAreaPixels: Area) => setCroppedAreaPixels(croppedAreaPixels);

  const process_upload_File = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      if (!file || !croppedAreaPixels) return;

      const croppedImage = await getCroppedImg(URL.createObjectURL(file), file.name, croppedAreaPixels);
      if (!croppedImage) return;

      const compressedImage = await compressImage(croppedImage);

      await upload_media(compressedImage.blob);
    } catch (e) {
      console.error(e);
      toast('Something Went Wrong', {
        description: 'Unable to upload image, if the issue persists please contact support',
        action: {
          label: 'Ok',
          onClick: () => {},
        },
      });
      handleRollBack();
    }
  };

  return {
    crop,
    zoom,
    croppedAreaPixels,
    onCropChange,
    onZoomChange,
    onCropComplete,
    process_upload_File,
  };
};
