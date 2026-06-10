import { useEffect, useState } from 'react';
import { useFile } from '../context/fileProvider';

interface IUseGetAspect {
  aspectProp?: number | null;
}

export const useGetAspect = ({ aspectProp }: IUseGetAspect) => {
  const { file } = useFile();
  const [aspect, setAspect] = useState<number>(aspectProp ?? 1);

  useEffect(() => {
    if (aspectProp) return;
    if (!file) return;
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      setAspect(img.width / img.height);
    };
  }, [file, aspectProp]);

  return { aspect };
};
