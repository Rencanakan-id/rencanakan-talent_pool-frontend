import { RegisterFormData } from '@/lib/register';

/**
 * Validates the completeness of a specific form step in the registration process
 *
 * @param formState - The current step of the form (1-4)
 * @param formData - The current registration form data
 * @returns Boolean indicating whether the current step is complete
 */
export const checkStepCompleteness = (formState: number, formData: RegisterFormData): boolean => {
  switch (formState) {
    case 1:
      return checkStepOneCompleteness(formData);
    case 2:
      return checkStepTwoCompleteness(formData);
    case 3:
      return checkStepThreeCompleteness(formData);
    case 4:
      return checkStepFourCompleteness(formData);
    default:
      return false;
  }
};

/**
 * Validates personal information from step 1
 */
function checkStepOneCompleteness(formData: RegisterFormData): boolean {
  return Boolean(
    formData.firstName &&
      formData.lastName &&
      formData.email &&
      formData.phoneNumber &&
      formData.nik &&
      formData.npwp
  );
}

/**
 * Validates professional information from step 2
 */
function checkStepTwoCompleteness(formData: RegisterFormData): boolean {
  return Boolean(
    formData.aboutMe &&
      formData.yearsOfExperience &&
      formData.skkLevel &&
      formData.currentLocation &&
      (formData.preferredLocations || []).length > 0 &&
      formData.skill &&
      (formData.skill !== 'lainnya' || (formData.skill === 'lainnya' && formData.otherSkill))
  );
}

/**
 * Validates pricing information from step 3
 */
function checkStepThreeCompleteness(formData: RegisterFormData): boolean {
  return Boolean(formData.price);
}

/**
 * Validates password and terms from step 4
 */
function checkStepFourCompleteness(formData: RegisterFormData): boolean {
  return Boolean(formData.password && formData.passwordConfirmation && formData.termsAndConditions);
}
