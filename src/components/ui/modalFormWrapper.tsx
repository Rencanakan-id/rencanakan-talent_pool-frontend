import { ReactNode } from "react";
import { Modal } from "./modal";
import { Button } from "./button";
import { Typography } from "../atoms/typography";

interface ModalFormWrapperProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  onSubmit: () => void;
  onDelete?: () => void;
  submitLabel?: string;
  children: ReactNode;
  isEditMode?: boolean;
}

export const ModalFormWrapper: React.FC<ModalFormWrapperProps> = ({
  isOpen,
  title,
  onClose,
  onSubmit,
  onDelete,
  submitLabel = "Submit",
  children,
  isEditMode = false,
}) => {
  return (
    <Modal size="large" title={title} isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col space-y-4 pt-1">
        {children}

        <div className={isEditMode ? "grid grid-cols-2 gap-2" : "flex justify-center items-center"}>
          {isEditMode && onDelete && (
            <Button
              variant="primary"
              data-testid="delete-button"
              className="rounded-md font-[500] bg-[rgba(196,61,75,0.95)] border-[rgba(196,61,75,0.95)] hover:bg-rencanakan-error-red-100 hover:border-rencanakan-error-red-100"
              onClick={onDelete}
            >
              <Typography variant="p2">Hapus</Typography>
            </Button>
          )}

          <Button
            variant="primary"
            data-testid="submit-button"
            className="rounded-md font-[500] w-full"
            onClick={onSubmit}
          >
            <Typography variant="p2">{submitLabel}</Typography>
          </Button>
        </div>
      </div>
    </Modal>
  );
};
