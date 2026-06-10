import { useMemo, useState } from 'react';
import type { Area, Point } from 'react-easy-crop';
import { toast } from 'sonner';
import getCroppedImg from './cropImg.func';
import prepareImageForUpload from './prepareImageForUpload';
import { uploadImage as uploadImage } from './getSignedUrlUpload';

type IUseImageUpload = {
  media: { id: string; url: string; key: string } | null;
  handleMediaUpload: (newMediaId: string | null) => void;
  clearErrors: () => void;
};

const useImageUpload = ({ media, handleMediaUpload, clearErrors }: IUseImageUpload) => {
  const [mediaObject, setMediaObject] = useState<{ id: string | null; url: string | null; key: string | null }>(
    media ?? { id: null, url: null, key: null },
  );

  const initMedia = useMemo(() => media ?? { id: null, url: null, key: null }, [media]);
  const setImageUrl = (img?: string) => img && setMediaObject((prev) => ({ ...prev, url: img || '' }));

  const [file, setFile] = useState<File | null>(null);
  const onFileChange = (value: File | null) => {
    setFile(value);
    clearErrors();
  };

  const [zoom, setZoom] = useState(1);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const [progress, setProgress] = useState(0);

  const currentDisplayed: 'fileUpload' | 'copper' | 'loading' | 'imgDisplayed' = useMemo(() => {
    if (progress > 0 && progress < 100) return 'loading';
    if (file) return 'copper';
    if (mediaObject.url) return 'imgDisplayed';
    return 'fileUpload';
  }, [file, mediaObject, progress]);

  const onZoomChange = (zoom: number) => setZoom(zoom);
  const onCropChange = (point: Point) => setCrop(point);
  const onCropComplete = (_: Point, croppedAreaPixels: Area) => setCroppedAreaPixels(croppedAreaPixels);

  const handleCancel = () => setFile(null);

  const rollBackToInitImage = (e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e?.preventDefault();
    setFile(null);
    setMediaObject(initMedia);
    setProgress(0);
    handleMediaUpload(initMedia.id);
  };

  const Crop_OptimizeImage = async () => {
    if (!croppedAreaPixels || !file) {
      return;
    }

    try {
      setProgress(5);

      const croppedImage = await getCroppedImg(URL.createObjectURL(file), file.name, croppedAreaPixels);
      if (!croppedImage) return;

      const optimizedImg = await prepareImageForUpload(croppedImage);
      const fileName = file.name.split('.')[0];

      setProgress(10);
      setFile(null);

      const { id } = await uploadImage({
        uploadedImg: optimizedImg.blob,
        name: fileName,
        setProgress: (progress: any) => {
          setProgress(progress);
        },
      });

      setImageUrl(URL.createObjectURL(croppedImage));
      handleMediaUpload(id);
      clearErrors();
    } catch (e) {
      console.error(e);
      toast('Something Went Wrong', {
        description: 'Unable to upload image, if the issue persists please contact support',
        action: {
          label: 'Ok',
          onClick: () => {},
        },
      });
      rollBackToInitImage();
    }
  };

  return {
    file,
    progress,
    img: mediaObject.url,
    crop,
    zoom,
    currentDisplayed,
    onCropChange,
    onZoomChange,
    onCropComplete,
    onFileChange,
    handleCancel,
    Crop_OptimizeImage,
    rollBackToInitImage,
  };
};

export default useImageUpload;
