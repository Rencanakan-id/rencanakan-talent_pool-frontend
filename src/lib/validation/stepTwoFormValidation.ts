/**
 * Validates a person's about me section
 * @param aboutMe The about me text to validate
 * @returns Empty string if valid, otherwise an error message
 */
export const validateAboutMe = (aboutMe: string | undefined): string => {
  if (!aboutMe) return "Tentang saya tidak boleh kosong";
  if (aboutMe.length < 10) return "Tentang saya minimal 10 karakter";
  return "";
};

/**
 * Validates years of experience selection
 * @param yearsOfExperience The selected years of experience
 * @returns Empty string if valid, otherwise an error message
 */
export const validateYearsOfExperience = (yearsOfExperience: string | undefined): string => {
  if (!yearsOfExperience) return "Lama pengalaman tidak boleh kosong";
  return "";
};

/**
 * Validates SKK level selection
 * @param skkLevel The selected SKK level
 * @returns Empty string if valid, otherwise an error message
 */
export const validateSKKLevel = (skkLevel: string | undefined): string => {
  if (!skkLevel) return "Level Sertifikasi SKK tidak boleh kosong";
  return "";
};

/**
 * Validates current location selection
 * @param currentLocation The selected current location
 * @returns Empty string if valid, otherwise an error message
 */
export const validateCurrentLocation = (currentLocation: string | undefined): string => {
  if (!currentLocation) return "Lokasi saat ini tidak boleh kosong";
  return "";
};

/**
 * Validates preferred locations selection
 * @param preferredLocations The array of selected preferred locations
 * @returns Empty string if valid, otherwise an error message
 */
export const validatePreferredLocations = (preferredLocations: string[] | undefined): string => {
  if (!preferredLocations || preferredLocations.length === 0) return "Lokasi penempatan tidak boleh kosong";
  if (preferredLocations.length > 5) return "Maksimal 5 lokasi dapat dipilih";
  return "";
};

/**
 * Validates skill selection
 * @param skill The selected skill
 * @returns Empty string if valid, otherwise an error message
 */
export const validateSkill = (skill: string | undefined): string => {
  if (!skill) return "Keahlian tidak boleh kosong";
  return "";
};

/**
 * Validates other skill selection
 * @param other The selected skill
 * @param otherSkill The custom skill entered if "lainnya" is selected
 * @returns Empty string if valid, otherwise an error message
 */
export const validateOtherSkill = (skill: string | undefined, otherSkill?: string): string => {
  console.log(skill + "  asd   " +  otherSkill);
  if (skill === "lainnya" && (!otherSkill || otherSkill.trim() === "")) return "Harap isi keahlian kamu";
  return "";
};

/**
 * Validates document file upload
 * @param file The file to validate
 * @param maxSizeMB Maximum file size in MB
 * @returns Empty string if valid, otherwise an error message
 */
export const validateFile = (file: File | undefined, maxSizeMB: number = 5): string => {
  if (!file) return "File tidak boleh kosong";
  
  // Check file size (convert MB to bytes)
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) return `Ukuran file melebihi ${maxSizeMB}MB`;
  
  // Check file type (allow only pdf, jpg, jpeg, png)
  const allowedTypes = ['.pdf', '.jpg', '.jpeg', '.png'];
  const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
  if (!allowedTypes.includes(fileExt)) return "Format file tidak didukung";
  
  return "";
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
  isValid: boolean, 
  errors: { 
    aboutMe?: string;
    yearsOfExperience?: string;
    skkLevel?: string;
    currentLocation?: string;
    preferredLocations?: string;
    skill?: string;
    otherSkill?: string;
    skkFile?: string;
  }
} => {
  const aboutMeError = validateAboutMe(formData.aboutMe);
  const yearsOfExperienceError = validateYearsOfExperience(formData.yearsOfExperience);
  const skkLevelError = validateSKKLevel(formData.skkLevel);
  const currentLocationError = validateCurrentLocation(formData.currentLocation);
  const preferredLocationsError = validatePreferredLocations(formData.preferredLocations);
  const skillError = validateSkill(formData.skill);
  const otherSkillError = validateOtherSkill(formData.skill, formData.otherSkill)
  const skkFileError = validateFile(formData.skkFile);
  
  const errors = {
    aboutMe: formData.aboutMe !== undefined ? aboutMeError : undefined,
    yearsOfExperience: formData.yearsOfExperience !== undefined ? yearsOfExperienceError : undefined,
    skkLevel: formData.skkLevel !== undefined ? skkLevelError : undefined,
    currentLocation: formData.currentLocation !== undefined ? currentLocationError : undefined,
    preferredLocations: formData.preferredLocations !== undefined ? preferredLocationsError : undefined,
    skill: formData.skill !== undefined ? skillError : undefined,
    otherSkill: formData.otherSkill !== undefined ? otherSkillError : undefined,
    skkFile: formData.skkFile !== undefined ? skkFileError : undefined,
  };

  const isValid = 
    aboutMeError === "" && 
    yearsOfExperienceError === "" && 
    skkLevelError === "" && 
    currentLocationError === "" && 
    preferredLocationsError === "" &&
    skillError === "" &&
    otherSkillError === ""

  return { isValid, errors };
};