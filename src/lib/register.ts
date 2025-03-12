export interface RegisterFormData {
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

  aboutMe?: string;
  yearsOfExperience?: string;
  skkLevel?: string;
  currentLocation?: string;
  preferredLocations?: string[];
  skill?: string;
  otherSkill?: string;
  skkFile?: File | null;

  price?: string;

  password?: string;
  passwordConfirmation?: string;
  termsAndConditions?: boolean;
}
