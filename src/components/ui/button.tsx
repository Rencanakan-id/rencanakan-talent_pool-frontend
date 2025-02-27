import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Typography } from '@/components';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'primary-outline' | 'secondary-outline' | 'link';

const buttonVariants = cva(
  'inline-flex justify-center items-center gap-[6px] rounded-[50px] cursor-pointer whitespace-nowrap transition-all duration-300 ease-in-out focus:outline-none border-2 disabled:cursor-not-allowed active:scale-95 active:shadow-inner hover:shadow-md',
  {
    variants: {
      variant: {
        primary:
          'bg-[var(--color-rencanakan-sea-blue-300)] text-white border-[var(--color-rencanakan-sea-blue-300)] hover:bg-[#001E31] hover:border-[#001E31] hover:scale-[1.02] active:bg-[#001E31] disabled:bg-[var(--color-rencanakan-base-gray)] disabled:border-[var(--color-rencanakan-base-gray)] disabled:text-white disabled:hover:scale-100 disabled:hover:shadow-none',
        secondary:
          'bg-[var(--color-rencanakan-premium-gold-300)] text-white border-[var(--color-rencanakan-premium-gold-300)] hover:bg-[var(--color-rencanakan-premium-gold-400)] hover:border-[var(--color-rencanakan-premium-gold-400)] hover:scale-[1.02] active:bg-[var(--color-rencanakan-premium-gold-400)] disabled:bg-[var(--color-rencanakan-base-gray)] disabled:border-[var(--color-rencanakan-base-gray)] disabled:text-white disabled:hover:scale-100 disabled:hover:shadow-none',
        'primary-outline':
          'bg-transparent text-[var(--color-rencanakan-sea-blue-300)] border-[var(--color-rencanakan-sea-blue-300)] hover:bg-[var(--color-rencanakan-sea-blue-300)] hover:text-white hover:scale-[1.02] active:bg-[#001E31] active:border-[#001E31] active:text-white disabled:bg-transparent disabled:border-[var(--color-rencanakan-base-gray)] disabled:text-[var(--color-rencanakan-base-gray)] disabled:hover:scale-100 disabled:hover:shadow-none',
        'secondary-outline':
          'bg-transparent text-[var(--color-rencanakan-premium-gold-300)] border-[var(--color-rencanakan-premium-gold-300)] hover:bg-[var(--color-rencanakan-premium-gold-300)] hover:text-white hover:scale-[1.02] active:bg-[var(--color-rencanakan-premium-gold-400)] active:border-[var(--color-rencanakan-premium-gold-400)] active:text-white disabled:bg-transparent disabled:border-[var(--color-rencanakan-base-gray)] disabled:text-[var(--color-rencanakan-base-gray)] disabled:hover:scale-100 disabled:hover:shadow-none',
        link: 'bg-transparent text-[var(--color-rencanakan-sea-blue-300)] border-transparent hover:text-[var(--color-rencanakan-sea-blue-300)] hover:underline hover:scale-100 hover:shadow-none active:text-[#001E31] active:scale-[0.98] disabled:text-[var(--color-rencanakan-base-gray)] disabled:no-underline disabled:hover:scale-100 disabled:hover:shadow-none p-0 border-0',
      },
      size: {
        default: 'h-[40px] px-[20px] py-[11px]',
        sm: 'h-[36px] px-[16px] py-[8px]',
        lg: 'h-[46px] px-[24px] py-[13px]',
        icon: 'h-[40px] w-[40px] p-[11px]',
        link: 'px-[8px] py-[11px]',
      },
    },
    defaultVariants: {
      variant: 'primary',
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

    const buttonSize = variant === 'link' && !size ? 'link' : size;

    return (
      <Comp
        className={cn(buttonVariants({ variant, size: buttonSize, className }))}
        ref={ref}
        {...props}
      >
        {icon && iconPosition === 'start' && (
          <span className="inline-flex h-4 w-4 items-center justify-center">{icon}</span>
        )}
        <Typography
          variant="b3"
          className={cn('font-semibold', variant === 'link' && 'underline-offset-4')}
        >
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
