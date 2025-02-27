import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Typography } from '@/components';
import { cn } from '@/lib/utils';

type Variant = 
  | 'button-blue' 
  | 'button-blue-outline' 
  | 'button-grey' 
  | 'button-orange' 
  | 'button-orange-outline';

const buttonVariants = cva(
  'inline-flex justify-center items-center gap-[6px] rounded-[50px] cursor-pointer box-border whitespace-nowrap h-[40px] transition-all duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        'button-blue': 'bg-[#00365A] text-white hover:bg-[#00365A]/90 border-2 border-[#00365A] focus:ring-[#00365A]/30',
        'button-blue-outline':
          'bg-transparent border-2 border-[#00365A] text-[#00365A] hover:bg-[#E6EEF3] hover:border-[#00365A] focus:ring-[#00365A]/30',
        'button-grey': 'bg-[#D7D7D7] text-white hover:bg-[#BFBFBF] border-2 border-[#D7D7D7] hover:border-[#BFBFBF] focus:ring-[#D7D7D7]/30',
        'button-orange': 'bg-[#FF9933] text-white hover:bg-[#FF8000] border-2 border-[#FF9933] hover:border-[#FF8000] focus:ring-[#FF9933]/30',
        'button-orange-outline':
          'bg-transparent border-2 border-[#FF9933] text-[#FF9933] hover:bg-[#FFEBCC] hover:border-[#FF8000] hover:text-[#FF8000] focus:ring-[#FF9933]/30',
      },
      size: {
        default: 'px-[20px] py-[8px]',
        sm: 'px-[16px] py-[6px]',
        lg: 'px-[24px] py-[8px]',
        icon: 'p-[8px]',
      },
    },
    defaultVariants: {
      variant: 'button-blue',
      size: 'default',
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  variant?: Variant;
  asChild?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'start' | 'end';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant, size, children, className, asChild = false, icon, iconPosition = 'start', ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props}>
        {icon && iconPosition === 'start' && (
          <span className="inline-flex h-4 w-4 items-center justify-center">{icon}</span>
        )}
        <Typography variant="b3" className="font-semibold">
          {children}
        </Typography>
        {icon && iconPosition === 'end' && (
          <span className="inline-flex h-4 w-4 items-center justify-center">{icon}</span>
        )}
      </Comp>
    );
  }
);

Button.displayName = 'Button';

export { buttonVariants };
