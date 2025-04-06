import * as React from 'react';

import { cn } from '@/lib/utils';
import { Typography } from '../atoms/typography';

interface TextareaProps extends React.ComponentProps<'textarea'> {
  textLabel?: string;
  error?: string;
}

const Textarea: React.FC<TextareaProps> = ({
  className,
  textLabel,
  placeholder,
  error,
  ...props
}) => {
  return (
    <div
      className={cn(
        'relative mt-8 min-w-[12rem] sm:min-w-[16rem] md:min-w-[24rem] lg:min-w-[455px]',
        className
      )}
    >
      {/* Label Positioning */}
      {textLabel && (
        <div className="absolute -top-3 left-3 bg-white px-1">
          <label className="text-rencanakan-dark-gray text-xs">{textLabel}</label>
        </div>
      )}

      <textarea
        placeholder={placeholder}
        className={cn(
          'placeholder:text-rencanakan-dark-gray h-20 w-full resize-none rounded-[2px] border p-2 text-xs placeholder:text-[11px] focus:ring-blue-300 focus:outline-none sm:h-24 sm:p-3 sm:text-[13px] sm:placeholder:text-[12px] md:h-[104px]',
          error ? 'border-rencanakan-error-red-100' : 'border-rencanakan-base-gray',
          className
        )}
        {...props}
      />

      {error && (
        <Typography variant="small" className="text-rencanakan-error-red-100 mt-1">
          {error}
        </Typography>
      )}
    </div>
  );
};

export { Textarea };
