import React, { ElementType } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';

// h = heading, s = subheading, b = body
type Variant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 's1'
  | 's2'
  | 's3'
  | 's4'
  | 's5'
  | 's6'
  | 'b1'
  | 'b2'
  | 'b3'
  | 'b4'
  | 'b5'
  | 'small';

const typographyVariants = cva('text-ellipsis', {
  variants: {
    variant: {
      h1: 'xxl:text-[4rem] xxl:leading-[calc(4rem*1)] xl:text-[3.5rem] xl:leading-[calc(3.5rem*1)] md:text-[2rem] md:leading-[calc(2rem*1)] text-[1.75rem] leading-[calc(1.75rem*1)] font-extrabold',
      h2: 'xxl:text-[3rem] xxl:leading-[calc(3rem*1.2)] xl:text-[2.2rem] xl:leading-[calc(2.2rem*1.2)] md:text-[2rem] md:leading-[calc(2rem*1.2)] text-[1.5rem] leading-[calc(1.5rem*1.2)] font-extrabold',
      h3: 'xxl:text-[2rem] xxl:leading-[calc(2rem*1.2)] xl:text-[1.85rem] xl:leading-[calc(1.85rem*1.2)] md:text-[1.5rem] md:leading-[calc(1.5rem*1.2)] text-[1.25rem] leading-[calc(1.25rem*1.2)] font-extrabold',
      h4: 'xxl:text-[1.75rem] xxl:leading-[calc(1.75rem*1.2)] xl:text-[1.5rem] xl:leading-[calc(1.5rem*1.2)] md:text-[1.25rem] md:leading-[calc(1.25rem*1.2)] text-[1.1rem] leading-[calc(1.1rem*1.2)] font-bold',
      h5: 'xxl:text-[1.5rem] xxl:leading-[calc(1.5rem*1.2)] xl:text-[1.3rem] xl:leading-[calc(1.3rem*1.2)] md:text-[1.1rem] md:leading-[calc(1.1rem*1.2)] text-[1rem] leading-[calc(1rem*1.2)] font-bold',
      h6: 'xxl:text-[1.25rem] xxl:leading-[calc(1.25rem*1.2)] xl:text-[1.1rem] xl:leading-[calc(1.1rem*1.2)] md:text-[1rem] md:leading-[calc(1rem*1.2)] text-[0.9rem] leading-[calc(0.9rem*1.2)] font-bold',

      s1: 'xxl:text-[2.9rem] xxl:leading-[calc(2.9rem*1.2)] xl:text-[2.2rem] xl:leading-[calc(2.2rem*1.2)] md:text-[1.75rem] md:leading-[calc(1.75rem*1.2)] text-[1.5rem] leading-[calc(1.5rem*1.2)] font-bold',
      s2: 'xxl:text-[2rem] xxl:leading-[calc(2rem*1.2)] xl:text-[1.85rem] xl:leading-[calc(1.85rem*1.2)] md:text-[1.5rem] md:leading-[calc(1.5rem*1.2)] text-[1.1rem] leading-[calc(1.1rem*1.2)]',
      s3: 'xxl:text-[1.5rem] xxl:leading-[calc(1.5rem*1.2)] xl:text-[1.3rem] xl:leading-[calc(1.3rem*1.2)] md:text-[1.1rem] md:leading-[calc(1.1rem*1.2)] text-[1rem] leading-[calc(1rem*1.2)]',
      s4: 'xxl:text-[1.25rem] xxl:leading-[calc(1.25rem*1.2)] xl:text-[1.1rem] xl:leading-[calc(1.1rem*1.2)] md:text-[1rem] md:leading-[calc(1rem*1.2)] text-[0.9rem] leading-[calc(0.9rem*1.2)]',
      s5: 'xxl:text-[1rem] xxl:leading-[calc(1rem*1.2)] xl:text-[0.9rem] xl:leading-[calc(0.9rem*1.2)] md:text-[0.85rem] md:leading-[calc(0.85rem*1.2)] text-[0.75rem] leading-[calc(0.75rem*1.2)]',
      s6: 'xxl:text-[0.85rem] xxl:leading-[calc(0.85rem*1.2)] xl:text-[0.75rem] xl:leading-[calc(0.75rem*1.2)] md:text-[0.7rem] md:leading-[calc(0.7rem*1.2)] text-[0.65rem] leading-[calc(0.65rem*1.2)]',

      b1: 'xxl:text-[1.5rem] xxl:leading-[calc(1.5rem*1.5)] xl:text-[1.4rem] xl:leading-[calc(1.4rem*1.5)] md:text-[1.3rem] md:leading-[calc(1.3rem*1.5)] text-[1.1rem] leading-[calc(1.1rem*1.5)]',
      b2: 'xxl:text-[1.25rem] xxl:leading-[calc(1.25rem*1.5)] xl:text-[1.2rem] xl:leading-[calc(1.2rem*1.5)] md:text-[1.1rem] md:leading-[calc(1.1rem*1.5)] text-[1rem] leading-[calc(1rem*1.5)]',
      b3: 'xxl:text-[1rem] xxl:leading-[calc(1rem*1.5)] xl:text-[0.9rem] xl:leading-[calc(0.9rem*1.5)] md:text-[0.85rem] md:leading-[calc(0.85rem*1.5)] text-[0.78rem] leading-[calc(0.78rem*1.5)]',
      b4: 'xxl:text-[0.85rem] xxl:leading-[calc(0.85rem*1.5)] xl:text-[0.75rem] xl:leading-[calc(0.75rem*1.5)] md:text-[0.7rem] md:leading-[calc(0.7rem*1.5)] text-[0.65rem] leading-[calc(0.65rem*1.5)]',
      b5: 'xxl:text-[0.8rem] xxl:leading-[calc(0.8rem*1.5)] xl:text-[0.75rem] xl:leading-[calc(0.75rem*1.5)] md:text-[0.7rem] md:leading-[calc(0.7rem*1.5)] text-[0.65rem] leading-[calc(0.65rem*1.5)]',
      small:
        'xxl:text-[0.7rem] xxl:leading-[calc(0.7rem*1.5)] xl:text-[0.65rem] xl:leading-[calc(0.65rem*1.5)] md:text-[0.6rem] md:leading-[calc(0.6rem*1.5)] text-[0.55rem] leading-[calc(0.55rem*1.5)]',
    },
  },
  defaultVariants: { variant: 'b3' },
});

const tags: Record<Variant, ElementType> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  s1: 'h2',
  s2: 'h3',
  s3: 'h4',
  s4: 'h5',
  s5: 'h6',
  s6: 'h6',
  b1: 'p',
  b2: 'p',
  b3: 'p',
  b4: 'p',
  b5: 'p',
  small: 'span',
};

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant: Variant;
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
}

export const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ variant, children, className, asChild = false }, ref) => {
    const Comp = asChild ? Slot : tags[variant];
    return (
      <Comp className={cn(typographyVariants({ variant, className }))} ref={ref}>
        {children}
      </Comp>
    );
  }
);

Typography.displayName = 'Typography';
