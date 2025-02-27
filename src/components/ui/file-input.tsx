import * as React from 'react';
import { cn } from '@/lib/utils';
import { VariantProps, cva } from 'class-variance-authority';
import { IoClose } from 'react-icons/io5';
import { Typography } from '../atoms/typography';

const fileInputVariants = cva(
  [
    'w-full rounded-lg border border-solid relative file:text-white',
    'file:min-h-[2.5rem] file:py-2 file:px-4 file:justify-center file:items-center file:gap-2 file:rounded-l-lg file:rounded-r-none file:border-t-[2px] file:border-b-[2px] file:border-l-[2px] file:border-dashed file:border-[var(--color-rencanakan-base-gray)] file:bg-[var(--color-rencanakan-sea-blue-300)] file:mr-4',
    'xxl:text-[1.25rem] xxl:leading-[calc(1.25rem*1.5)] xl:text-[1.2rem] xl:leading-[calc(1.2rem*1.5)] md:text-[1.1rem] md:leading-[calc(1.1rem*1.5)] text-[1rem] leading-[calc(1rem*1.5)]',
  ],
  {
    variants: {
      state: {
        empty:
          'border-[var(--color-rencanakan-base-gray)] bg-[var(--color-rencanakan-light-gray)] text-[var(--color-rencanakan-main-black)]',
        filled:
          'border-[var(--color-rencanakan-base-gray)] text-[var(--color-rencanakan-success-100)] bg-[var(--color-rencanakan-success-25)]',
        error:
          'border-[var(--color-rencanakan-base-gray)] text-[var(--color-rencanakan-error-100)] bg-[var(--color-rencanakan-error-25)]',
      },
    },
    defaultVariants: {
      state: 'empty',
    },
  }
);

interface FileInputProps
  extends Omit<React.ComponentProps<'input'>, 'type'>,
    VariantProps<typeof fileInputVariants> {
  onClear?: () => void;
  textLabel?: string;
}

export const FileInput: React.FC<FileInputProps> = ({
  className,
  state,
  onClear,
  textLabel,
  ...props
}) => {
  const [fileState, setFileState] = React.useState<'empty' | 'filled' | 'error'>('empty');
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (state) {
      setFileState(state);
    }
  }, [state]);

  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    setFileState('empty');
    onClear?.();
  };

  return (
    <div className="relative">
      {textLabel && (
        <div className="mb-3">
          <label className="text-lg font-bold text-[var(--color-rencanakan-main-black)]">
            <Typography variant={'b2'}>{textLabel}</Typography>
          </label>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        data-slot="input"
        className={cn(fileInputVariants({ state: fileState }), className)}
        onChange={(e) => {
          const files = e.target.files;
          if (files && files.length > 0) {
            const file = files[0];
            if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
              setFileState('filled');
            } else {
              setFileState('error');
            }
          } else {
            setFileState('empty');
          }
          props.onChange?.(e);
        }}
        {...props}
      />
      {(fileState === 'filled' || fileState === 'error') && (
        <button
          type="button"
          onClick={handleClear}
          className="xxl:top-[70px] absolute top-1/2 top-[58px] right-4 -translate-y-1/2 rounded-lg p-1 hover:bg-black/10 md:top-[62px] xl:top-[66px]"
        >
          <IoClose size={18} />
        </button>
      )}
    </div>
  );
};
