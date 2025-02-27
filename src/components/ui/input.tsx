import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Typography } from '@/components';

type Variant = 'default' | 'small';

const inputVariants = cva(
  'flex rounded-[4px] border border-[var(--color-rencanakan-base-gray)] bg-transparent px-3 py-[9px] text-[var(--color-rencanakan-main-black)] placeholder:text-[var(--color-rencanakan-dark-gray)] outline-none w-full',
  {
    variants: {
      hasPrefix: {
        true: 'pl-8',
        false: '',
      },
      hasPrefixText: {
        true: 'pl-9',
        false: '',
      },
      isError: {
        true: 'border-[var(--color-rencanakan-error-red-100)]',
        false: '',
      },
    },
    defaultVariants: {
      hasPrefix: false,
      hasPrefixText: false,
      isError: false,
    },
  }
);

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  label?: string;
  prefixIcon?: React.ReactNode;
  prefixText?: string;
  error?: string;
  variant?: Variant;
  width?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type, label, variant = 'default', prefixIcon, prefixText, error, width, ...props },
    ref
  ) => {
    // Determine input styling conditions
    const hasPrefix = !!prefixIcon;
    const hasPrefixText = !!prefixText;
    const isError = !!error;

    const containerWidth = width ? width : variant === 'small' ? 'calc(50% - 0.5rem)' : '100%';

    return (
      <div className="inline-block" style={{ width: containerWidth }}>
        <div className="relative w-full">
          {prefixIcon && (
            <span className="absolute top-1/2 left-3 -translate-y-1/2 text-[var(--color-rencanakan-dark-gray)]">
              {prefixIcon}
            </span>
          )}
          {prefixText && (
            <span className="absolute top-1/2 left-3 -translate-y-1/2 text-[var(--color-rencanakan-dark-gray)]">
              {prefixText}
            </span>
          )}
          <input
            type={type}
            ref={ref}
            className={cn(inputVariants({ hasPrefix, hasPrefixText, isError }), className)}
            placeholder={props.placeholder || ' '}
            {...props}
          />
          {label && (
            <span className="absolute -top-2 left-2 bg-[var(--color-rencanakan-pure-white)] px-1">
              <Typography variant="b4" className="text-[var(--color-rencanakan-dark-gray)]">
                {label}
              </Typography>
            </span>
          )}
        </div>
        {error && (
          <Typography variant="small" className="mt-1 text-[var(--color-rencanakan-error-red-100)]">
            {error}
          </Typography>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { inputVariants };
