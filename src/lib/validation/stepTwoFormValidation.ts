import { validateFile } from './fileValidation';

/**
 * Validates a person's about me section
 * @param aboutMe The about me text to validate
 * @returns Empty string if valid, otherwise an error message
 */
export const validateAboutMe = (aboutMe: string | undefined): string => {
  if (!aboutMe) return 'Tentang saya tidak boleh kosong';
  if (aboutMe.length < 10) return 'Tentang saya minimal 10 karakter';
  return '';
};

/**
 * Validates years of experience selection
 * @param yearsOfExperience The selected years of experience
 * @returns Empty string if valid, otherwise an error message
 */
export const validateYearsOfExperience = (yearsOfExperience: string | undefined): string => {
  if (!yearsOfExperience) return 'Lama pengalaman tidak boleh kosong';
  return '';
};

/**
 * Validates SKK level selection
 * @param skkLevel The selected SKK level
 * @returns Empty string if valid, otherwise an error message
 */
export const validateSKKLevel = (skkLevel: string | undefined): string => {
  if (!skkLevel) return 'Level Sertifikasi SKK tidak boleh kosong';
  return '';
};

/**
 * Validates current location selection
 * @param currentLocation The selected current location
 * @returns Empty string if valid, otherwise an error message
 */
export const validateCurrentLocation = (currentLocation: string | undefined): string => {
  if (!currentLocation) return 'Lokasi saat ini tidak boleh kosong';
  return '';
};

/**
 * Validates preferred locations selection
 * @param preferredLocations The array of selected preferred locations
 * @returns Empty string if valid, otherwise an error message
 */
export const validatePreferredLocations = (preferredLocations: string[] | undefined): string => {
  if (!preferredLocations || preferredLocations.length === 0)
    return 'Lokasi penempatan tidak boleh kosong';
  if (preferredLocations.length > 5) return 'Maksimal 5 lokasi dapat dipilih';
  return '';
};

/**
 * Validates skill selection
 * @param skill The selected skill
 * @returns Empty string if valid, otherwise an error message
 */
export const validateSkill = (skill: string | undefined): string => {
  if (!skill) return 'Keahlian tidak boleh kosong';
  return '';
};

/**
 * Validates other skill selection
 * @param other The selected skill
 * @param otherSkill The custom skill entered if "lainnya" is selected
 * @returns Empty string if valid, otherwise an error message
 */
export const validateOtherSkill = (skill: string | undefined, otherSkill?: string): string => {
  if (skill === 'lainnya' && (!otherSkill || otherSkill.trim() === ''))
    return 'Harap isi keahlian kamu';
  return '';
};

/**
 * Validates the entire Step Two form
 * @param formData The form data to validate
 * @returns An object containing validation status and errors
 */
export const validateStepTwoForm = (formData: {
  aboutMe?: string;
  yearsOfExperience?: string;
  skkLevel?: string;
  currentLocation?: string;
  preferredLocations?: string[];
  skill?: string;
  otherSkill?: string;
  skkFile?: File;
}): {
  isValid: boolean;
  errors: {
    aboutMe?: string;
    yearsOfExperience?: string;
    skkLevel?: string;
    currentLocation?: string;
    preferredLocations?: string;
    skill?: string;
    otherSkill?: string;
    skkFile?: string;
  };
} => {
  const errorsResult = {
    aboutMe: validateAboutMe(formData.aboutMe),
    yearsOfExperience: validateYearsOfExperience(formData.yearsOfExperience),
    skkLevel: validateSKKLevel(formData.skkLevel),
    currentLocation: validateCurrentLocation(formData.currentLocation),
    preferredLocations: validatePreferredLocations(formData.preferredLocations),
    skill: validateSkill(formData.skill),
    otherSkill: validateOtherSkill(formData.skill, formData.otherSkill),
    skkFile: validateFile(formData.skkFile),
  };

  const activeErrors: Partial<typeof errorsResult> = {};
  let isValid = true;

  for (const key in errorsResult) {
    const errorValue = errorsResult[key as keyof typeof errorsResult];
    if (errorValue) {
      activeErrors[key as keyof typeof errorsResult] = errorValue;
      isValid = false;
    }
  }

  return { isValid, errors: activeErrors };
};
