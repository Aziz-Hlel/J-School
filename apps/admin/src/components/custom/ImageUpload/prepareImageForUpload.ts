interface ImageOptimizationOptions {
  maxWidth?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
}

const prepareImageForUpload = async (
  file: File | Blob,
  options: ImageOptimizationOptions = {},
): Promise<{
  blob: Blob;
  format: string;
  width: number;
  height: number;
  originalSize: number;
  optimizedSize: number;
}> => {
  // Default options with professional values
  const { quality = 0.85, format = 'webp' } = options;

  // Set appropriate mime type
  const mimeTypes = {
    webp: 'image/webp',
    jpeg: 'image/jpeg',
    png: 'image/png',
  };
  const mimeType = mimeTypes[format];

  // Create an image element to load the file
  const img = new Image();

  const imgLoaded = new Promise<void>((resolve) => {
    img.onload = () => resolve();
  });

  // Create object URL safely
  const objectUrl = URL.createObjectURL(file);
  img.src = objectUrl;
  await imgLoaded;

  // Calculate new dimensions while maintaining aspect ratio
  let width = img.width;
  let height = img.height;
  // if (width > maxWidth) {
  //   height = Math.round((height * maxWidth) / width);
  //   width = maxWidth;
  // }

  // Create canvas and draw resized image
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  // Draw with proper image smoothing for high quality results
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, width, height);

  // Convert to desired format with specified quality
  const optimizedBlob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Canvas conversion failed'));
        }
      },
      mimeType,
      quality,
    );
  });

  // Clean up resources
  URL.revokeObjectURL(objectUrl);

  return {
    blob: optimizedBlob,
    format,
    width,
    height,
    originalSize: file.size,
    optimizedSize: optimizedBlob.size,
  };
};

export default prepareImageForUpload;
