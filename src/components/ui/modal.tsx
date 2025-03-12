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
  'relative rounded-lg bg-white shadow-lg overflow-y-auto mx-auto max-h-[90vh]',
  {
    variants: {
      size: {
        small: 'p-4 w-full sm:w-auto sm:max-w-sm',
        medium: 'p-6 w-full sm:w-auto sm:max-w-md',
        large: 'p-8 w-full sm:w-auto sm:max-w-lg',
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
  onBackdropKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
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
      onBackdropKeyDown,
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

    // Handle click outside modal content
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
      // Check if the click is on the backdrop (outside the modal content)
      if (e.target === e.currentTarget) {
        onClose(); // Close the modal
      }
    };

    // Handle keyboard events for the backdrop
    const handleBackdropKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      // If custom onKeyDown is provided, call it
      if (onBackdropKeyDown) {
        onBackdropKeyDown(e);
      } else {
        // Default behavior: Close the modal on 'Esc'
        if (e.key === 'Escape') {
          onClose();
        }
      }
    };

    return (
      <div
        className={cn(modalVariants({ isError }), className)}
        onClick={handleBackdropClick} // Add onClick handler for backdrop
        onKeyDown={handleBackdropKeyDown} // Add onKeyDown handler for keyboard accessibility
        role="button" // Indicate that this element is interactive
        tabIndex={0} // Make the element focusable
        aria-label="Close modal" // Provide a meaningful label for screen readers
        {...props}
        ref={ref}
      >
        {/* Modal Content */}
        <div
          className={cn(modalContentVariants({ size }))}
          onClick={(e) => e.stopPropagation()} // Stop propagation to prevent closing when clicking inside modal
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition-colors close-icon"
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
          <div className="overflow-y-auto">{children}</div>
        </div>
      </div>
    );
  }
);

Modal.displayName = 'Modal';

export { modalVariants };