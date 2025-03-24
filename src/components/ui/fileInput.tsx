import * as React from 'react';
import { cn } from '@/lib/utils';
import { VariantProps, cva } from 'class-variance-authority';
import { IoClose } from 'react-icons/io5';
import { FiPlus } from 'react-icons/fi';
import { Typography } from '../atoms/typography';

const fileContainerVariants = cva(['w-full flex items-center']);

const buttonVariants = cva([
  'min-h-[2.5rem] py-2 px-5 flex justify-center items-center gap-2 rounded-tl-lg rounded-bl-lg border-l-[2px] border-t-[2px] border-b-[2px] border-dashed border-rencanakan-base-gray bg-rencanakan-sea-blue-400 text-white transition-all duration-200 ease-in-out hover:bg-rencanakan-sea-blue-300',
  'xxl:text-[0.8125rem] xxl:leading-[calc(0.8125rem*1.5)] xl:text-[0.8rem] xl:leading-[calc(0.8rem*1.5)] md:text-[0.75rem] md:leading-[calc(0.75rem*1.5)] text-[0.7rem] leading-[calc(0.7rem*1.5)]',
]);

const fileInputWrapperVariants = cva(
  [
    'flex-1 rounded-tr-lg rounded-br-lg border border-solid relative min-h-[2.5rem] border-[2px] flex items-center overflow-hidden',
  ],
  {
    variants: {
      state: {
        empty: 'border-rencanakan-base-gray bg-rencanakan-light-gray text-rencanakan-main-black',
        filled:
          'border-rencanakan-base-gray text-rencanakan-success-green-100 bg-rencanakan-success-green-25',
        error:
          'border-rencanakan-base-gray text-rencanakan-error-red-100 bg-rencanakan-error-red-25',
      },
    },
    defaultVariants: {
      state: 'empty',
    },
  }
);

const fileNameVariants = cva([
  'w-full h-full py-1 px-3 flex items-center',
  'xxl:text-[0.8125rem] xxl:leading-[calc(0.8125rem*1.5)] xl:text-[0.8rem] xl:leading-[calc(0.8rem*1.5)] md:text-[0.75rem] md:leading-[calc(0.75rem*1.5)] text-[0.7rem] leading-[calc(0.7rem*1.5)]',
]);

const errorVariants = cva([
  'text-rencanakan-error-red-100 mt-1',
  'xxl:text-[0.75rem] xxl:leading-[calc(0.75rem*1.5)] xl:text-[0.75rem] xl:leading-[calc(0.75rem*1.5)] md:text-[0.7rem] md:leading-[calc(0.7rem*1.5)] text-[0.65rem] leading-[calc(0.65rem*1.5)]',
]);

interface FileInputProps
  extends Omit<React.ComponentProps<'input'>, 'type'>,
    VariantProps<typeof fileInputWrapperVariants> {
  onClear?: () => void;
  textLabel?: string;
  icon?: React.ReactNode;
  buttonText?: string;
  onFileSelect?: (file: File | null) => void;
  value?: string;
  maxSize?: number;
  error?: string;
}

export const FileInput: React.FC<FileInputProps> = ({
  className,
  state,
  onClear,
  textLabel,
  value,
  onFileSelect,
  error,
  ...inputProps
}) => {
  const [fileState, setFileState] = React.useState<'empty' | 'filled' | 'error'>(state || 'empty');
  const [fileName, setFileName] = React.useState<string>(value || '');
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (state !== undefined) {
      setFileState(state || 'empty');
    }
  }, [state]);

  React.useEffect(() => {
    if (value !== undefined) {
      setFileName(value);
    }
  }, [value]);

  React.useEffect(() => {
    if (error) {
      setFileState('error');
    }
  }, [error]);

  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    setFileName('');
    setFileState('empty');
    onClear?.();
    onFileSelect?.(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];

      if (value === undefined) {
        setFileName(file.name);
      }

      setFileState('filled');
      onFileSelect?.(file);
    } else {
      if (value === undefined) {
        setFileName('');
      }
      setFileState('empty');
      onFileSelect?.(null);
    }

    if (inputProps.onChange) {
      inputProps.onChange(e);
    }
  };

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  const displayFileName = fileName ? (
    <span className="font-bold">{fileName.toUpperCase()}</span>
  ) : (
    'Tidak ada file yang dipilih'
  );

  return (
    <div className="relative">
      {textLabel && (
        <div className="mb-3">
          <label className="text-rencanakan-main-black font-bold">
            <Typography variant={'p3'}>{textLabel}</Typography>
          </label>
        </div>
      )}

      <div className={fileContainerVariants()}>
        <button
          type="button"
          onClick={handleButtonClick}
          className={buttonVariants()}
          aria-label="Pilih File"
        >
          <FiPlus size={18} />
        </button>

        <div className={cn(fileInputWrapperVariants({ state: fileState }), className)}>
          <div className={fileNameVariants()}>
            <div className="w-full overflow-hidden pr-8 text-ellipsis whitespace-nowrap">
              <Typography variant="p5">{displayFileName}</Typography>
            </div>
          </div>

          {(fileState === 'filled' || fileState === 'error') && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute top-1/2 right-2 -translate-y-1/2 rounded-lg p-1 hover:bg-black/10"
            >
              <IoClose size={18} />
            </button>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
          {...inputProps}
        />
      </div>

      {error && (
        <div className={errorVariants()}>
          <Typography variant="p5">{error}</Typography>
        </div>
      )}
    </div>
  );
};
