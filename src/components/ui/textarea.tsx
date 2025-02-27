import * as React from "react";

import { cn } from "@/lib/utils";

interface TextareaProps extends React.ComponentProps<"textarea"> {
  textLabel?: string;
}

const Textarea: React.FC<TextareaProps> = ({ className, textLabel, placeholder, ...props }) => {
  return (
    <div className={cn("relative mt-8 min-w-[12rem] sm:min-w-[16rem] md:min-w-[24rem] lg:min-w-[455px]", className)}>
      {/* Label Positioning */}
      {textLabel && (
        <div className="absolute -top-3 left-3 pr-1 bg-white">
          <label className="text-xs text-[#70787F]">{textLabel}</label>
        </div>
      )}

      <textarea
        placeholder={placeholder}
        className={cn("placeholder:text-[13px] resize-none placeholder:text-[#3A3A3A] w-full h-[104px] p-3 border border-[#D7D7D7] rounded-[2px] focus:outline-none focus:ring-2 focus:ring-blue-300", className)}
        {...props}
      />
    </div>
  );
};

export { Textarea };
