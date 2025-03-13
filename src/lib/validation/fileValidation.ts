/**
 * Validates document file upload
 * @param file The file to validate
 * @param maxSizeMB Maximum file size in MB
 * @returns Empty string if valid, otherwise an error message
 */
export const validateFile = (file: File | undefined | null, maxSizeMB: number = 5): string => {
  if (!file) return '';

  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) return `Ukuran file melebihi ${maxSizeMB}MB`;

  const allowedTypes = ['.pdf', '.jpg', '.jpeg', '.png'];
  const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
  if (!allowedTypes.includes(fileExt)) return 'Format file tidak didukung';

  return '';
};
