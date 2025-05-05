import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalizeString(str: string): string {
  // Handle empty string
  if (!str) return str;
  
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function formatIndonesianPhoneNumber(phoneNumber: string): string {
  const cleanedNumber = phoneNumber.replace(/\D/g, '');

  if (cleanedNumber.startsWith('0')) {
    return '+62 ' + cleanedNumber.substring(1);
  }

  if (cleanedNumber.startsWith('62')) {
    return '+' + cleanedNumber;
  }

  return '+62 ' + cleanedNumber;
}
