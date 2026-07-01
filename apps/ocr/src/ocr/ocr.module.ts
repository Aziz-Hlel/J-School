import { OcrProvider } from './ocr.provider';
import { AwsStorageService, OcrService } from './ocr.service';
import { OcrWorker } from './ocr.worker';

const OcrModule = () => {
  const storageService = new AwsStorageService();
  const ocrProvider = new OcrProvider();
  const ocrService = new OcrService(storageService, ocrProvider);
  const worker = new OcrWorker(ocrService);
  worker.createWorker();

  return {
    worker,
  };
};

export default OcrModule;
