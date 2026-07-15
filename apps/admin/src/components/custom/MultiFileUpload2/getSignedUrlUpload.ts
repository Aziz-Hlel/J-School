import { mediaService } from '@/api/service/mediaService';
import type { IMimeType } from '@repo/contracts/schemas/media/MimeType/mimeTypes';

import axios from 'axios';
import { toast } from 'sonner';

type getSignedUrlUploadParams = {
  fileName: string;
  mimeType: string;
  fileSize: number;
};

export const getSignedUrlUpload = async ({ fileName, mimeType, fileSize }: getSignedUrlUploadParams) => {
  const response = await mediaService.presignedUrl({
    mimeType: mimeType as IMimeType,
    fileSize,
    name: fileName,
  });

  if (!response.success) {
    throw new Error();
  }
  return response.data;
};

export const uploadImage = async ({
  uploadedImg,
  name,
  setProgress,
}: {
  uploadedImg: Blob;
  name: string;
  setProgress: (value: number | null) => void;
}) => {
  const { type: mimeType, size } = uploadedImg;

  const { url, key, id } = await getSignedUrlUpload({
    fileName: name,
    mimeType,
    fileSize: size,
  });

  // const response = await Http.put(url, uploadedImg);

  try {
    await axios.put(url, uploadedImg, {
      headers: { 'Content-Type': uploadedImg.type },
      onUploadProgress: (event) => {
        const percent = Math.round((event.loaded * 100) / (event.total || 1));
        setProgress(percent);
      },
    });

    setProgress(100);
    setTimeout(() => setProgress(null), 500); // Reset after complete
  } catch {
    setProgress(null);
    toast.error('Image upload failed. Please try again.');
  } finally {
    // setUploading(false);
  }

  return {
    id,
    key,
    url,
  };
};
