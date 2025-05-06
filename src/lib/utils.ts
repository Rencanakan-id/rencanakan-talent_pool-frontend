import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { RefObject } from 'react';

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

type UpdateFn<T> = (data: Partial<T>) => void;

interface HandleHargaChangeParams<T> {
  e: React.ChangeEvent<HTMLInputElement>;
  updateFn: UpdateFn<T>;
  inputRef: RefObject<HTMLInputElement>;
  key: keyof T;
}

export const handleHargaChange = <T>({
  e,
  updateFn,
  inputRef,
  key,
}: HandleHargaChangeParams<T>) => {
  const rawValue = e.target.value.replace(/[^\d]/g, '');
  updateFn({ [key]: rawValue } as Partial<T>);

  if (inputRef.current) {
    inputRef.current.value = `${formatToRupiah(rawValue)}`;
  }
};

export const formatToRupiah = (number: string | number) => {
    if (!number) return '';
    const numStr = Number(number).toString();
    let formatted = '';
    let counter = 0;

    for (let i = numStr.length - 1; i >= 0; i--) {
      formatted = numStr[i] + formatted;
      counter++;
      if (counter % 3 === 0 && i !== 0) {
        formatted = '.' + formatted;
      }
    }
    return `Rp${formatted}`;
  };

export const parseExperienceYearsToString = (yearsExp: number): string | undefined => {
    switch (yearsExp) {
      case 0:
        return '< 1 Tahun'
      case 1:
        return '1 Tahun';
      case 2:
        return '2-3 Tahun';
      case 3:
        return '4-5 Tahun';
      case 4:
        return '> 5 Tahun';
    }
  };

export const parseExperienceYearsToInt = (yearsExp: string): number| undefined => {
    switch (yearsExp) {
      case '< 1 Tahun':
        return 0;
      case '1 Tahun':
        return 1;
      case '2-3 Tahun':
        return 2;
      case '4-5 Tahun':
        return 3;
      case '> 5 Tahun':
        return 4;
    }
  };
