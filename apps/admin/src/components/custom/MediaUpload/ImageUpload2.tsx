import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import type { MediaResponse } from '@repo/contracts/schemas/media/MediaResponse';
import type { DropzoneOptions } from 'react-dropzone';
import { Controller, type FieldValues, type Path, type UseFormReturn } from 'react-hook-form';
import { FileProvider } from './context/fileProvider';
import CircularProgressBar from './helper/CircularProgressBar ';
import useImageUpload from './hooks/use-Image-Upload';
import { mediaState } from './types/MediaState';
import FileUploadComp from './ui/FileUploadComp';
import ImageCropperCom from './ui/ImageCropperCom';
import ImageDisplayedComp from './ui/ImageDisplayedComp';

interface ImageUploadProps<T extends FieldValues> {
  initMedia: MediaResponse | null;
  mediaErrors: (string | undefined)[];
  form: UseFormReturn<T>;
  fieldName: Path<T>;
  options?: {
    /**
     * Maximum size of the file in MB
     */
    maxSize?: number;
    /**
     * Aspect ratio of the image, if null or not set, it will use the aspect ratio of the uploaded image
     */
    aspect?: number | null;
  };
}

const isString = <T extends FieldValues>(media: unknown, fieldName: Path<T>): media is string => {
  if (typeof media !== 'string') {
    throw new Error(`Media Upload Component: "${String(fieldName)}" must be a string but got ${typeof media}`);
  }
  return true;
};

const MediaUpload_Main = <T extends FieldValues>({ fieldName, mediaErrors, options, form }: ImageUploadProps<T>) => {
  const { currentDisplayed } = useImageUpload();

  const media = form.getValues(fieldName);

  isString(media, fieldName);

  const maxSizeInMB = 4;
  const maxSizeInBytes = (options?.maxSize ?? maxSizeInMB) * 1024 * 1024;

  const dropZoneConfig: DropzoneOptions = {
    maxFiles: 1,
    maxSize: maxSizeInBytes,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
      'video/*': ['.mp4', '.webm', '.ogg'],
    },
    multiple: false,
  };

  const hasErrors = mediaErrors.filter((err) => err !== undefined).length > 0;

  const setError = (message: string) => {
    form.setError(fieldName, { message });
  };

  console.log({ formErrors: form.formState.errors[fieldName], fieldName });

  // useEffect(() => {
  //   form.setError(fieldName, { message: 'zibbii' });
  // }, []);

  return (
    <Controller<T>
      name={fieldName}
      control={form.control}
      render={({ fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={`${fieldName}-input`}>Thumbnail</FieldLabel>
          <FieldDescription>
            {currentDisplayed === mediaState.UPLOAD_FILE && 'Select an image to upload.'}
            {currentDisplayed === mediaState.CROP && 'Crop Image to 9:16'}
            {currentDisplayed === mediaState.UPLOADING_MEDIA && 'Uploading Media...'}
            {currentDisplayed === mediaState.READY && 'Uploaded Image'}
          </FieldDescription>

          {currentDisplayed === mediaState.UPLOAD_FILE && (
            <FileUploadComp maxSizeInBytes={maxSizeInBytes} dropZoneConfig={dropZoneConfig} hasErrors={hasErrors} />
          )}

          {currentDisplayed === mediaState.CROP && <ImageCropperCom aspect={options?.aspect} />}

          {currentDisplayed === mediaState.UPLOADING_MEDIA && (
            <div className='relative flex h-full w-full flex-col justify-start'>
              <div className='mx-auto flex h-full items-center justify-center gap-2'>
                <span className='-translate-y-0.5'>Loading</span>
                <CircularProgressBar />
              </div>
            </div>
          )}

          {currentDisplayed === mediaState.READY && (
            <ImageDisplayedComp
              maxSizeInBytes={maxSizeInBytes}
              dropZoneConfig={dropZoneConfig}
              hasErrors={hasErrors}
              setError={setError}
            />
          )}

          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};

const MediaUpload = <T extends FieldValues>({
  fieldName,
  initMedia,
  mediaErrors,
  options,
  form,
}: ImageUploadProps<T>) => {
  return (
    <>
      <FileProvider initMedia={initMedia} form={form} fieldName={fieldName}>
        <div className='h-105'>
          <MediaUpload_Main
            fieldName={fieldName}
            initMedia={initMedia}
            mediaErrors={mediaErrors}
            options={options}
            form={form}
          />
        </div>
      </FileProvider>
    </>
  );
};

export default MediaUpload;
