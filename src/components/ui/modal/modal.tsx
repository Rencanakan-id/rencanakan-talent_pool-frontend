// import { ReactNode } from 'react';

// /**
//  * Model for Modal component variants
//  */
// export type ModalVariant = 'default' | 'alert' | 'confirm' | 'success' | 'danger' | 'warning' | 'info';

// /**
//  * Model for Modal component sizes
//  */
// export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

// /**
//  * Model for Modal scroll behavior options
//  */
// export type ScrollBehavior = 'inside' | 'outside' | 'none';

// /**
//  * Model for Modal position options
//  */
// export type ModalPosition = 'center' | 'top' | 'bottom';

// /**
//  * Model for Modal backdrop styles
//  */
// export type ModalBackdrop = 'default' | 'blur' | 'transparent';

// /**
//  * Model for Modal animation types
//  */
// export type ModalAnimation = 'none' | 'fade' | 'zoom' | 'slide';

// /**
//  * Base Modal interface with all configurable properties
//  */
// export interface ModalModel {
//   isOpen: boolean;
//   onClose: () => void;
//   children: ReactNode;
//   title?: ReactNode;
//   description?: ReactNode;
//   variant?: ModalVariant;
//   size?: ModalSize;
//   hideCloseButton?: boolean;
//   position?: ModalPosition;
//   backdrop?: ModalBackdrop;
//   footer?: ReactNode;
//   closeOnEscape?: boolean;
//   closeOnOutsideClick?: boolean;
//   animation?: ModalAnimation;
//   scrollBehavior?: ScrollBehavior;
//   onAfterClose?: () => void;
//   asChild?: boolean;
//   maxHeight?: string;
//   preventScroll?: boolean;
// }

// /**
//  * Confirm Modal interface with specific properties
//  */
// export interface ConfirmModalModel extends Omit<ModalModel, 'children' | 'variant'> {
//   message: ReactNode;
//   confirmLabel?: string;
//   cancelLabel?: string;
//   onConfirm: () => void;
//   danger?: boolean;
// }

// /**
//  * Alert Modal interface with specific properties
//  */
// export interface AlertModalModel extends Omit<ModalModel, 'children' | 'variant'> {
//   message: ReactNode;
//   buttonLabel?: string;
//   variant?: 'success' | 'danger' | 'warning' | 'info';
// }

// /**
//  * Input Modal interface with specific properties for form inputs
//  */
// export interface InputModalModel extends Omit<ModalModel, 'children'> {
//   label: string;
//   initialValue?: string;
//   placeholder?: string;
//   confirmLabel?: string;
//   cancelLabel?: string;
//   onSubmit: (value: string) => void;
//   inputType?: 'text' | 'textarea';
//   required?: boolean;
//   validation?: (value: string) => string | null;
// }

// /**
//  * Drawer Modal interface with side-specific properties
//  */
// export interface DrawerModalModel extends Omit<ModalModel, 'position' | 'animation'> {
//   side?: 'left' | 'right';
// }

// /**
//  * Complete Modal Model that combines all modal type configurations
//  */
// export type ModalModels = {
//   Modal: ModalModel;
//   ConfirmModal: ConfirmModalModel;
//   AlertModal: AlertModalModel;
//   InputModal: InputModalModel;
//   DrawerModal: DrawerModalModel;
// };

// /**
//  * Factory function to create a basic modal configuration
//  */
// export const createModalModel = (
//   config: Partial<ModalModel> & { isOpen: boolean; onClose: () => void; children: ReactNode }
// ): ModalModel => {
//   return {
//     variant: 'default',
//     size: 'md',
//     hideCloseButton: false,
//     position: 'center',
//     backdrop: 'default',
//     closeOnEscape: true,
//     closeOnOutsideClick: true,
//     animation: 'fade',
//     scrollBehavior: 'inside',
//     asChild: false,
//     preventScroll: true,
//     ...config
//   };
// };

// /**
//  * Factory function to create a confirm modal configuration
//  */
// export const createConfirmModalModel = (
//   config: Partial<ConfirmModalModel> & { 
//     isOpen: boolean; 
//     onClose: () => void; 
//     message: ReactNode;
//     onConfirm: () => void;
//   }
// ): ConfirmModalModel => {
//   return {
//     confirmLabel: 'Konfirmasi',
//     cancelLabel: 'Batal',
//     danger: false,
//     size: 'md',
//     hideCloseButton: false,
//     position: 'center',
//     backdrop: 'default',
//     closeOnEscape: true,
//     closeOnOutsideClick: true,
//     animation: 'fade',
//     scrollBehavior: 'inside',
//     asChild: false,
//     preventScroll: true,
//     ...config
//   };
// };

// /**
//  * Factory function to create an alert modal configuration
//  */
// export const createAlertModalModel = (
//   config: Partial<AlertModalModel> & { 
//     isOpen: boolean; 
//     onClose: () => void; 
//     message: ReactNode 
//   }
// ): AlertModalModel => {
//   return {
//     buttonLabel: 'OK',
//     variant: 'info',
//     size: 'md',
//     hideCloseButton: false,
//     position: 'center',
//     backdrop: 'default',
//     closeOnEscape: true,
//     closeOnOutsideClick: true,
//     animation: 'fade',
//     scrollBehavior: 'inside',
//     asChild: false,
//     preventScroll: true,
//     ...config
//   };
// };

// /**
//  * Factory function to create an input modal configuration
//  */
// export const createInputModalModel = (
//   config: Partial<InputModalModel> & { 
//     isOpen: boolean; 
//     onClose: () => void; 
//     label: string;
//     onSubmit: (value: string) => void;
//   }
// ): InputModalModel => {
//   return {
//     initialValue: '',
//     placeholder: '',
//     confirmLabel: 'Simpan',
//     cancelLabel: 'Batal',
//     inputType: 'text',
//     required: false,
//     variant: 'default',
//     size: 'md',
//     hideCloseButton: false,
//     position: 'center',
//     backdrop: 'default',
//     closeOnEscape: true,
//     closeOnOutsideClick: true,
//     animation: 'fade',
//     scrollBehavior: 'inside',
//     asChild: false,
//     preventScroll: true,
//     ...config
//   };
// };

// /**
//  * Factory function to create a drawer modal configuration
//  */
// export const createDrawerModalModel = (
//   config: Partial<DrawerModalModel> & { 
//     isOpen: boolean; 
//     onClose: () => void; 
//     children: ReactNode 
//   }
// ): DrawerModalModel => {
//   return {
//     side: 'right',
//     size: 'md',
//     hideCloseButton: false,
//     backdrop: 'default',
//     closeOnEscape: true,
//     closeOnOutsideClick: true,
//     scrollBehavior: 'inside',
//     asChild: false,
//     preventScroll: true,
//     ...config
//   };
// };

// export default {
//   createModalModel,
//   createConfirmModalModel,
//   createAlertModalModel,
//   createInputModalModel,
//   createDrawerModalModel
// };