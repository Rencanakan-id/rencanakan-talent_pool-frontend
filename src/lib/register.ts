export interface RegisterFormData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  nik?: string;
  npwp?: string;
  ktpFile?: File | null;
  npwpFile?: File | null;
  diplomaFile?: File | null;

  // Buat step 2
  address?: string;
  city?: string;

  // Buat step 3
  price?: string;

  // Buat step 4
  password?: string;
  passwordConfirmation?: string;
  termsAndConditions?: boolean;
}