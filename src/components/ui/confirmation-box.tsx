import React from 'react';
import { Dialog, DialogContent, DialogOverlay, DialogPortal } from '@/components/ui/dialog';
import { Button, ButtonProps } from '@/components/ui/button';
import { Typography } from '@/components/atoms/typography';
import { cn } from '@/lib/utils';

interface ConfirmationBoxProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  cancelButtonText?: string;
  confirmButtonText?: string;
  confirmButtonVariant?: ButtonProps['variant'];
  additionalMessage?: string;
  className?: string;
}

export const ConfirmationBox: React.FC<ConfirmationBoxProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  cancelButtonText = 'Tidak',
  confirmButtonText = 'Iya',
  confirmButtonVariant = 'primary',
  additionalMessage,
  className,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogPortal>
        <DialogOverlay className="bg-black/10 fixed inset-0"/>
        <DialogContent
          className={cn(
            "fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] rounded-[10px] bg-white p-6 shadow-lg md:w-full",
            className
          )}
        >
          <div className="flex flex-col space-y-4 mt-2">
            <Typography variant="h3" className="text-center w-full">
              {title}
            </Typography>

            <div className="flex flex-col items-center space-y-4 py-2">
              <Typography variant="p2" className="text-center font-medium">
                {description}
              </Typography>
              
              {additionalMessage && (
                <Typography variant="p4" className="text-center text-gray-500">
                  {additionalMessage}
                </Typography>
              )}
            </div>
            
            <div className="flex w-full justify-between space-x-4 pt-4">
              <Button 
                variant="primary-outline" 
                onClick={onClose} 
                className="w-full"
              >
                {cancelButtonText}
              </Button>
              <Button 
                variant={confirmButtonVariant}
                onClick={() => {
                  onConfirm();
                  onClose();
                }} 
                className="w-full"
              >
                {confirmButtonText}
              </Button>
            </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};
