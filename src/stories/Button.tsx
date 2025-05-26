import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex justify-center items-center gap-[6px] rounded-[50px] cursor-pointer whitespace-nowrap transition-all duration-300 ease-in-out focus:outline-none disabled:cursor-not-allowed active:scale-95 hover:shadow-md font-semibold text-sm sm:text-base xxl:text-[0.875rem] xxl:leading-[calc(0.875rem*1.5)] xl:text-[0.85rem] xl:leading-[calc(0.85rem*1.5)] md:text-[0.8rem] md:leading-[calc(0.8rem*1.5)]',
  {
    variants: {
      variant: {
        primary:
          'bg-rencanakan-sea-blue-300 text-white border-[1px] border-rencanakan-sea-blue-300 hover:bg-rencanakan-sea-blue-500 hover:border-rencanakan-sea-blue-500 hover:scale-[1.02] active:bg-rencanakan-sea-blue-500 disabled:bg-rencanakan-base-gray disabled:border-rencanakan-base-gray disabled:text-white disabled:hover:scale-100 disabled:hover:shadow-none',
        secondary:
          'bg-rencanakan-premium-gold-300 text-white border-[1px] border-rencanakan-premium-gold-300 hover:bg-rencanakan-premium-gold-400 hover:border-rencanakan-premium-gold-400 hover:scale-[1.02] active:bg-rencanakan-premium-gold-400 disabled:bg-rencanakan-base-gray disabled:border-rencanakan-base-gray disabled:text-white disabled:hover:scale-100 disabled:hover:shadow-none',
        'primary-outline':
          'bg-transparent text-rencanakan-sea-blue-300 border border-rencanakan-sea-blue-300 sm:border-[1px] hover:bg-rencanakan-sea-blue-300 hover:text-white hover:scale-[1.02] active:bg-rencanakan-sea-blue-500 active:border-rencanakan-sea-blue-500 active:text-white disabled:bg-transparent disabled:border-rencanakan-base-gray disabled:text-rencanakan-base-gray disabled:hover:scale-100 disabled:hover:shadow-none',
        'secondary-outline':
          'bg-transparent text-rencanakan-premium-gold-300 border border-rencanakan-premium-gold-300 sm:border-[1px] hover:bg-rencanakan-premium-gold-300 hover:text-white hover:scale-[1.02] active:bg-rencanakan-premium-gold-400 active:border-rencanakan-premium-gold-400 active:text-white disabled:bg-transparent disabled:border-rencanakan-base-gray disabled:text-rencanakan-base-gray disabled:hover:scale-100 disabled:hover:shadow-none',
        link: 'bg-transparent text-rencanakan-sea-blue-300 border-transparent hover:text-rencanakan-sea-blue-300 hover:underline hover:scale-100 hover:shadow-none active:text-rencanakan-sea-blue-500 active:scale-[0.98] disabled:text-rencanakan-base-gray disabled:no-underline disabled:hover:scale-100 disabled:hover:shadow-none p-0 border-0',
      },
      size: {
        default: 'h-9 px-[14px] py-[9px] sm:h-10 sm:px-5 sm:py-[11px]',
        sm: 'h-8 px-3 py-[7px] sm:h-9 sm:px-4 sm:py-2',
        lg: 'h-10 px-4 py-[9px] sm:h-11 sm:px-6 sm:py-[13px]',
        icon: 'h-9 w-9 p-[9px] sm:h-10 sm:w-10 sm:p-[11px]',
        link: 'px-1.5 py-[9px] sm:px-2 sm:py-[11px]',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  // variant?: Variant;
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

    const buttonSize = variant === 'link' && !size ? 'link' : size;

    const buttonClassName = cn(
      buttonVariants({ variant, size: buttonSize }),
      variant === 'link' && 'underline-offset-4',
      className
    );

    return (
      <Comp className={buttonClassName} ref={ref} {...props}>
        {icon && iconPosition === 'start' && (
          <span className="inline-flex h-3 w-3 items-center justify-center sm:h-4 sm:w-4">
            {icon}
          </span>
        )}
        {children}
        {icon && iconPosition === 'end' && (
          <span className="inline-flex h-3 w-3 items-center justify-center sm:h-4 sm:w-4">
            {icon}
          </span>
        )}
      </Comp>
    );
  }
);

Button.displayName = 'Button';

export { buttonVariants };
