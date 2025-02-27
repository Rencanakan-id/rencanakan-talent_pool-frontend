import * as React from "react";

import { cn } from "@/lib/utils";

interface TextareaProps extends React.ComponentProps<"textarea"> {
  textLabel?: string;
}

const Textarea: React.FC<TextareaProps> = ({ className, textLabel, placeholder, ...props }) => {
  return (
    <div className={cn("relative mt-8 w-[455px]", className)}>
      {/* Label Positioning */}
      {textLabel && (
        <div className="absolute -top-3 left-3 px-1 bg-white">
          <label className="text-xs text-gray-600">{textLabel}</label>
        </div>
      )}

      <textarea
        style={{resize: 'none'}}
        placeholder={placeholder}
        className="placeholder:text-[13px] w-full p-3 border border-gray-300 rounded-[2px] focus:outline-none focus:ring-2 focus:ring-blue-300"
        {...props}
      />
    </div>
  );
};

export { Textarea };
