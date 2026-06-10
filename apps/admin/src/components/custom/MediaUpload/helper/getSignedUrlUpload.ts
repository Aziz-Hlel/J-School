import { mediaService } from '@/Api/service/mediaService';
import type { IMimeType } from '@repo/contracts/schemas/media/IMimeType';

import axios from 'axios';
import { toast } from 'sonner';

type getSignedUrlUploadParams = {
  fileName: string;
  mimeType: string;
  fileType: IMimeType;
  fileSize: number;
};

export const getSignedUrlUpload = async ({ fileName, mimeType, fileType, fileSize }: getSignedUrlUploadParams) => {
  const response = await mediaService.presignedUrl({
    mimeType: mimeType,
    fileSize,
    fileType: fileType,
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
  setProgress: Function;
}) => {
  const { type: mimeType, size } = uploadedImg;

  const [_, subtype] = mimeType.split('/');

  const { url, key, id } = await getSignedUrlUpload({
    fileName: name,
    mimeType,
    fileType: subtype as IMimeType,
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
  } catch (err) {
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
