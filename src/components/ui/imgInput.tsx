import * as React from 'react';
import { cn } from '@/lib/utils';
import { Typography } from '../atoms/typography';
interface ImageUploadProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'value' | 'onChange'> {
  onImageChange?: (file: File | null) => void;
  label?: string;
  maxSize?: number;
  initialImage?: File | null;
}

const ImageUpload = React.forwardRef<HTMLInputElement, ImageUploadProps>(
  (
    { label, className, onImageChange, maxSize = 5 * 1024 * 1024, initialImage = null, ...props },
    ref
  ) => {
    const [selectedFile, setSelectedFile] = React.useState<File | null>(initialImage);
    const [preview, setPreview] = React.useState<string | null>(null);
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
      if (!selectedFile) {
        setPreview(null);
        return;
      }

      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    }, [selectedFile]);

    React.useEffect(() => {
      if (initialImage) {
        setSelectedFile(initialImage);
      }
    }, [initialImage]);

    const handleClick = () => {
      fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;

      if (file && file.size > maxSize) {
        setErrorMessage(
          `Ukuran gambar yang Anda unggah melebihi batas maksimum ${maxSize / (1024 * 1024)}MB.`
        );
        return;
      }

      setErrorMessage(null);
      setSelectedFile(file);
      if (onImageChange) {
        onImageChange(file);
      }
    };

    const handleDelete = (e: React.MouseEvent) => {
      e.stopPropagation();
      setSelectedFile(null);
      setPreview(null);
      if (onImageChange) {
        onImageChange(null);
      }
    };

    return (
      <div className="flex w-full max-w-sm flex-col gap-2">
        {label && (
          <Typography variant={'p5'} className="text-rencanakan-dark-gray text-sm font-semibold">
            {label}
          </Typography>
        )}
        <div>
          <div
            className={cn(
              'border-rencanakan-base-gray bg-rencanakan-light-gray relative aspect-square w-full max-w-[250px] cursor-pointer rounded-md border-2 border-dashed',
              'flex flex-col items-center justify-center gap-4 overflow-hidden',
              className
            )}
            onClick={handleClick}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleClick();
              }
            }}
            tabIndex={0}
            role="button"
            aria-label={label || 'Upload image'}
            {...props}
          >
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={ref || fileInputRef}
              onChange={handleFileChange}
            />

            {preview ? (
              <div className="absolute inset-0">
                <img
                  src={preview}
                  alt="Preview"
                  className="h-full w-full object-cover transition duration-300 ease-in-out hover:brightness-90"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(e);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedFile(null);
                      setPreview(null);
                      if (onImageChange) {
                        onImageChange(null);
                      }
                    }
                  }}
                  className="hover:bg-rencanakan-error-red-100 focus:ring-rencanakan-error-red-100 absolute top-2 right-2 cursor-pointer rounded-full bg-white p-1 text-gray-700 shadow-sm hover:text-white focus:ring-2 focus:outline-none"
                  aria-label="Delete image"
                  tabIndex={0}
                >
                  ✖
                </button>
              </div>
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center">
                <label className="text-rencanakan-dark-gray font-bold">
                  <Typography variant={'p5'}>Klik di sini untuk upload</Typography>
                </label>
              </div>
            )}
          </div>
          {errorMessage && (
            <Typography variant="small" className="text-rencanakan-error-red-100 mt-2">
              {errorMessage}
            </Typography>
          )}
        </div>
      </div>
    );
  }
);

ImageUpload.displayName = 'ImageUpload';

export { ImageUpload };
