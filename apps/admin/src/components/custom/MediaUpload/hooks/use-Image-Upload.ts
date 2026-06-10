import { useMemo } from 'react';
import { useFile } from '../context/fileProvider';
import { mediaState, type MediaState } from '../types/MediaState';

const useImageUpload = () => {
  const { file, mediaUrl, progress } = useFile();

  const currentDisplayed: MediaState = useMemo(() => {
    if (progress > 0 && progress < 100) return mediaState.UPLOADING_MEDIA;
    if (file) return mediaState.CROP;
    if (mediaUrl) return mediaState.READY;
    return mediaState.UPLOAD_FILE;
  }, [file, mediaUrl, progress]);

  return {
    currentDisplayed,
  };
};

export default useImageUpload;
