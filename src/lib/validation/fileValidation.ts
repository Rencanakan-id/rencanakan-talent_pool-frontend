/**
 * Validates document file upload
 * @param file The file to validate
 * @param maxSizeMB Maximum file size in MB
 * @returns Empty string if valid, otherwise an error message
 */
export const validateFile = (file: File | undefined, maxSizeMB: number = 5): string => {
  if (!file) return 'File tidak boleh kosong';

  // Check file size (convert MB to bytes)
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) return `Ukuran file melebihi ${maxSizeMB}MB`;

  // Check file type (allow only pdf, jpg, jpeg, png)
  const allowedTypes = ['.pdf', '.jpg', '.jpeg', '.png'];
  const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
  if (!allowedTypes.includes(fileExt)) return 'Format file tidak didukung';

  return '';
};
