import type { DropzoneOptions } from 'react-dropzone';
import { useMemo } from 'react';
import useImageUpload from '../use-Image-Upload';
import CircularProgressBar from '../CircularProgressBar ';
import FileUploadComp from './FileUploadComp';
import ImageCropperCom from './ImageCropperCom';
import ImageDisplayedComp from './ImageDisplayedComp';

type ImageUploadProps = {
  initMedia: { id: string; url: string; key: string } | null;
  mediaErrors: (string | undefined)[];
  handleMediaUpload: (newMediaId: string | null) => void;
  clearMediaErrors: () => void;
};

const ImageUpload = ({ initMedia, mediaErrors, handleMediaUpload, clearMediaErrors }: ImageUploadProps) => {
  const maxSizeInMB = 4;

  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

  const dropZoneConfig: DropzoneOptions = {
    maxFiles: 1,
    maxSize: maxSizeInBytes,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
    },
    multiple: false,
  };

  const {
    currentDisplayed,
    file,
    img,
    progress,
    zoom,
    crop,
    Crop_OptimizeImage,
    rollBackToInitImage,
    handleCancel,
    onZoomChange,
    onCropChange,
    onCropComplete,
    onFileChange,
  } = useImageUpload({
    media: initMedia,
    clearErrors: clearMediaErrors,
    handleMediaUpload,
  });

  const imgUrl: string | undefined = useMemo(() => (file ? URL.createObjectURL(file) : undefined), [file]);

  const hasErrors = mediaErrors.filter((err) => err !== undefined).length > 0;

  return (
    <>
      <div className='h-105'>
        {currentDisplayed === 'fileUpload' && (
          <FileUploadComp
            onFileChange={onFileChange}
            maxSizeInBytes={maxSizeInBytes}
            dropZoneConfig={dropZoneConfig}
            hasErrors={hasErrors}
          />
        )}

        {currentDisplayed === 'copper' && (
          <ImageCropperCom
            imgUrl={imgUrl}
            crop={crop}
            zoom={zoom}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            handleCancel={handleCancel}
            Crop_OptimizeImage={Crop_OptimizeImage}
            onCropComplete={onCropComplete}
          />
        )}

        {currentDisplayed === 'loading' && (
          <div className='relative flex h-full w-full flex-col justify-start'>
            <div className='mb-1 w-full text-left text-sm font-semibold'>Thumbnail</div>
            <div className='mb-4 w-full text-left text-sm font-light text-gray-600'>Loading ...</div>
            <div className='mx-auto flex h-full items-center justify-center gap-2'>
              <span className='-translate-y-0.5'>Loading</span>
              <CircularProgressBar progress={progress} />
            </div>
          </div>
        )}

        {currentDisplayed === 'imgDisplayed' && (
          <ImageDisplayedComp
            img={img}
            maxSizeInBytes={maxSizeInBytes}
            dropZoneConfig={dropZoneConfig}
            onFileChange={onFileChange}
            rollBackToInitImage={rollBackToInitImage}
            hasErrors={hasErrors}
          />
        )}
        {mediaErrors.map((errorMessage, index) => (
          <div key={index} className='text-sm text-red-500'>
            {errorMessage}
          </div>
        ))}
      </div>
    </>
  );
};

export default ImageUpload;
