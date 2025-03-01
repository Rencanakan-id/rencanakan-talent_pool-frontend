import * as React from 'react';

import { cn } from '@/lib/utils';

interface TextareaProps extends React.ComponentProps<'textarea'> {
  textLabel?: string;
}

const Textarea: React.FC<TextareaProps> = ({ className, textLabel, placeholder, ...props }) => {
  return (
    <div
      className={cn(
        'relative mt-8 min-w-[12rem] sm:min-w-[16rem] md:min-w-[24rem] lg:min-w-[455px]',
        className
      )}
    >
      {/* Label Positioning */}
      {textLabel && (
        <div className="absolute -top-3 left-3 bg-white pr-1">
          <label className="text-xs text-[#70787F]">{textLabel}</label>
        </div>
      )}

      <textarea
        placeholder={placeholder}
        className={cn(
          'h-[104px] w-full resize-none rounded-[2px] border border-[#D7D7D7] p-3 placeholder:text-[13px] placeholder:text-[#3A3A3A] focus:ring-2 focus:ring-blue-300 focus:outline-none',
          className
        )}
        {...props}
      />
    </div>
  );
};

export { Textarea };
