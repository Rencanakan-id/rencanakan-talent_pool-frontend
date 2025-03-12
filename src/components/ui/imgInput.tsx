import * as React from 'react';
import { cn } from '@/lib/utils';
import { Typography } from '../atoms/typography';

interface ImageUploadProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'value' | 'onChange'> {
  onImageChange?: (file: File | null) => void;
  label?: string;
  maxSize?: number;
  className?: string;
}

const ImageUpload = ({label, className = '', onImageChange, maxSize = 5 * 1024 * 1024, ...props}: ImageUploadProps) => {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
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
          <button
            type="button"
            className={cn(
              "relative w-full aspect-square max-w-[250px] rounded-md border-2 border-dashed border-rencanakan-base-gray bg-rencanakan-light-gray cursor-pointer",
              "flex flex-col justify-center items-center gap-4 overflow-hidden",
              className
            )}
            onClick={handleClick}
            {...props}
          >
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />

            {preview ? (
              <div className="absolute inset-0">
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="w-full h-full object-cover hover:brightness-90 transition duration-300 ease-in-out"
                />
                <button
                  onClick={handleDelete}
                  className="absolute top-2 right-2 text-white p-1 hover:text-rencanakan-error-red-100"
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
          </button>
          {errorMessage && (
            <Typography variant="small" className="text-rencanakan-error-red-100 mt-2">
              {errorMessage}
            </Typography>
          )}
        </div>
      </div>
    );
  }
  

ImageUpload.displayName = 'ImageUpload';

export { ImageUpload };
