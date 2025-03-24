/**
 * Registration form data, divided into 4 steps:
 * 1. Personal info & documents
 * 2. Professional profile
 * 3. Pricing
 * 4. Account & agreement
 * 
 * Fields with `| null` are optional.
 */
export interface RegisterFormData {
  // Step 1: Personal info & documents
  profilePhoto?: File | null;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  nik?: string;
  npwp?: string;
  ktpFile?: File | null;
  npwpFile?: File | null;
  diplomaFile?: File | null;

  // Step 2: Professional profile
  aboutMe?: string;
  yearsOfExperience?: string;
  skkLevel?: string;
  currentLocation?: string;
  preferredLocations?: string[];
  skill?: string;
  otherSkill?: string;
  skkFile?: File | null;

  // Step 3: Pricing
  price?: string;

  // Step 4: Account & agreement
  password?: string;
  passwordConfirmation?: string;
  termsAndConditions?: boolean;
}
