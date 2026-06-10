import type { MediaResponse } from '@repo/contracts/schemas/media/MediaResponse';
import { createContext, useContext, useEffect, useState } from 'react';
import { uploadImage } from '../helper/getSignedUrlUpload';
import { toast } from 'sonner';
import type { FieldValues, Path, UseFormReturn } from 'react-hook-form';

type FileContextType = {
  file: File | null;
  handleFileChange: (file: File | null) => void;
  mediaUrl: string | undefined;
  handleRollBack: () => void;
  media: MediaResponse | null;
  upload_media: (compressedImage: Blob) => Promise<void>;
  progress: number;
};

const FileContext = createContext<FileContextType | null>(null);

interface FileProviderProps<T extends FieldValues> {
  children: React.ReactNode;
  initMedia: MediaResponse | null;
  form: UseFormReturn<T>;
  fieldName: Path<T>;
}

export function FileProvider<T extends FieldValues>({ children, initMedia, form, fieldName }: FileProviderProps<T>) {
  const [file, setFile] = useState<File | null>(null);
  const [media, setMedia] = useState<MediaResponse | null>(initMedia);
  const mediaUrl = media?.url ?? undefined;
  const [progress, setProgress] = useState(0);

  const handleFileChange = (file: File | null) => {
    setFile(file);
  };

  const handleRollBack = (e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e?.preventDefault();
    setFile(null);
    setMedia(initMedia);
  };

  useEffect(() => {
    if (media?.id) {
      // form.setValue(fieldName, media?.id ?? ('' as any), media?.id ? { shouldDirty: true, shouldValidate: true } : undefined,);
      form.setValue(fieldName, media.id as any, { shouldDirty: true, shouldValidate: true });
      form.clearErrors(fieldName);
    }
  }, [media?.id]);

  // const setFormFieldValue = () => {
  //     form.setValue(fieldName, media?.id ?? ('' as any), { shouldDirty: true, shouldValidate: true });
  //     form.clearErrors(fieldName)
  // }

  const upload_media = async (compressedImage: Blob) => {
    if (!file) return;
    try {
      const fileName = file?.name.split('.')[0];

      setProgress(10);
      setFile(null); // forgot why

      const { id } = await uploadImage({
        uploadedImg: compressedImage,
        name: fileName,
        setProgress: (progress: any) => {
          setProgress(progress);
        },
      });

      const newMediaUrl = URL.createObjectURL(compressedImage);
      const newMedia: MediaResponse = { id, url: newMediaUrl, key: '' };
      setMedia(newMedia);
      //   clearErrors();
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

  const values = { file, handleFileChange, mediaUrl, handleRollBack, media, upload_media, progress };
  return <FileContext.Provider value={values}>{children}</FileContext.Provider>;
}

export const useFile = () => {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error('useFile must be used within a FileProvider');
  }
  return context;
};
