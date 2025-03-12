/**
 * Validates a password against security requirements
 * @param password The password to validate
 * @returns Empty string if valid, otherwise an error message
 */
export const validatePassword = (password: string | undefined): string => {
  if (!password) return 'Kata sandi tidak boleh kosong';
  if (password.length < 8) return 'Kata sandi minimal 8 karakter';
  if (!/[A-Z]/.test(password)) return 'Kata sandi harus memiliki huruf kapital';
  if (!/[a-z]/.test(password)) return 'Kata sandi harus memiliki huruf kecil';
  if (!/\d/.test(password)) return 'Kata sandi harus memiliki angka';
  if (/[ \t]/.test(password)) return 'Kata sandi tidak boleh mengandung spasi';
  return '';
};

/**
 * Validates that password confirmation matches the password
 * @param password The original password
 * @param confirmation The confirmation password
 * @returns Empty string if valid, otherwise an error message
 */
export const validatePasswordMatch = (
  password: string | undefined,
  confirmation: string | undefined
): string => {
  if (!confirmation) return 'Konfirmasi kata sandi tidak boleh kosong';
  if (password !== confirmation) return 'Kata sandi tidak cocok';
  return '';
};

/**
 * Validates the entire password section including terms acceptance
 * @param password The password
 * @param confirmation The confirmation password
 * @param termsAccepted Whether terms and conditions have been accepted
 * @returns An object containing validation status and errors
 */
export const validatePasswordSection = (
  password: string | undefined,
  confirmation: string | undefined,
  termsAccepted: boolean | undefined
): {
  isValid: boolean;
  errors: { password?: string; passwordConfirmation?: string };
} => {
  const passwordError = validatePassword(password);
  const confirmationError = validatePasswordMatch(password, confirmation);

  const errors = {
    password: password !== undefined ? passwordError : undefined,
    passwordConfirmation: confirmation !== undefined ? confirmationError : undefined,
  };

  const isValid = passwordError === '' && confirmationError === '' && !!termsAccepted;

  return { isValid, errors };
};
