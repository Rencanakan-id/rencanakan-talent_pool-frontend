import React, { ReactNode, useEffect } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Typography } from '@/components';

// Variants for the modal container (backdrop)
const modalVariants = cva(
  'fixed inset-0 z-50 flex items-center justify-center bg-black/50',
  {
    variants: {
      isError: {
        true: '',
        false: '',
      },
    },
    defaultVariants: {
      isError: false,
    },
  }
);

// Variants for the modal content
const modalContentVariants = cva(
  'relative rounded-lg bg-white shadow-lg overflow-y-auto mx-auto',
  {
    variants: {
      size: {
        small: 'p-4 w-auto max-w-sm',
        medium: 'p-6 w-auto max-w-md',
        large: 'p-8 w-auto max-w-lg',
      },
    },
    defaultVariants: {
      size: 'medium',
    },
  }
);

// Props interface for the Modal component
interface ModalProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof modalVariants> {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'small' | 'medium' | 'large';
  isError?: boolean;
}

// Modal Component
export const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      className,
      isOpen,
      onClose,
      title,
      children,
      size = 'medium',
      isError = false,
      ...props
    },
    ref
  ) => {
    // Disable body scrolling when modal is open
    useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = 'hidden'; // Prevent scrolling on the body
      } else {
        document.body.style.overflow = ''; // Restore scrolling when modal is closed
      }

      // Cleanup function to reset overflow when component unmounts
      return () => {
        document.body.style.overflow = '';
      };
    }, [isOpen]);

    // If the modal is not open, do not render anything
    if (!isOpen) return null;

    return (
      <div
        className={cn(modalVariants({ isError }), className)}
        {...props}
        ref={ref}
      >
        {/* Modal Content */}
        <div className={cn(modalContentVariants({ size }))}>
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            &times;
          </button>

          {/* Title */}
          {title && (
            <Typography variant="h6" className="mb-4 text-rencanakan-main-black">
              {title}
            </Typography>
          )}

          {/* Children Content */}
          <div>{children}</div>
        </div>
      </div>
    );
  }
);

Modal.displayName = 'Modal';

export { modalVariants };