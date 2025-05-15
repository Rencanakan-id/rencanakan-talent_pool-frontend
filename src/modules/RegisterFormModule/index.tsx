import { Button } from '@/components';
import { ReactNode, useState } from 'react';
import { StepOneForm } from './Section/register-1';
import { StepTwoForm } from './Section/register-2';
import { StepFourForm } from './Section/register-4';
import { RegisterFormData } from '@/lib/register';
import { StepThreeForm } from './Section/register-3';
import { validateStepFourForm } from '@/lib/validation/stepFourFormValidation';
import { validateStepOneForm } from '@/lib/validation/stepOneFormValidation';
import { validateStepTwoForm } from '@/lib/validation/stepTwoFormValidation';
import { checkStepCompleteness } from '@/lib/validation/formCompletenessValidation';
import { parseExperienceYearsToInt } from '@/lib/utils';
import * as Sentry from '@sentry/react';

export const RegisterModule = () => {
  const [formState, setFormState] = useState(1);
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    nik: '',
    npwp: '',
    ktpFile: undefined,
    npwpFile: undefined,
    diplomaFile: undefined,
    aboutMe: '',
    yearsOfExperience: '',
    skkLevel: '',
    currentLocation: '',
    preferredLocations: [] as string[],
    skill: '',
    otherSkill: '',
    skkFile: undefined,
    price: '',
    password: '',
    passwordConfirmation: '',
  });
  const [validationErrors, setValidationErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    nik?: string;
    npwp?: string;
    ktpFile?: string;
    npwpFile?: string;
    diplomaFile?: string;
    aboutMe?: string;
    yearsOfExperience?: string;
    skkLevel?: string;
    currentLocation?: string;
    preferredLocations?: string;
    skill?: string;
    otherSkill?: string;
    skkFile?: string;
    price?: string;
    password?: string;
    passwordConfirmation?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const updateFormData = (data: Partial<RegisterFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const isStepValid = checkStepCompleteness(formState, formData);

  type StepValidationFunction = (
    stepData: Partial<RegisterFormData>
  ) => { isValid: boolean; errors: Record<string, string> };

  interface StepConfig {
    validate?: StepValidationFunction;
    keys?: (keyof RegisterFormData)[];
  }

  const stepConfig: Record<number, StepConfig> = {
    1: {
      validate: validateStepOneForm as StepValidationFunction,
      keys: [
        'firstName',
        'lastName',
        'email',
        'phoneNumber',
        'nik',
        'npwp',
        'ktpFile',
        'npwpFile',
        'diplomaFile',
      ],
    },
    2: {
      validate: validateStepTwoForm as StepValidationFunction,
      keys: [
        'aboutMe',
        'yearsOfExperience',
        'skkLevel',
        'currentLocation',
        'preferredLocations',
        'skill',
        'otherSkill',
        'skkFile',
      ],
    },
  };

  const handleNext = () => {
    const currentStepConfig = stepConfig[formState];

    if (currentStepConfig?.validate && currentStepConfig.keys) {
      const stepDataToValidate: Partial<RegisterFormData> = {};
      currentStepConfig.keys.forEach((key) => {
        const value = formData[key];
        if (
          key === 'ktpFile' ||
          key === 'npwpFile' ||
          key === 'diplomaFile' ||
          key === 'skkFile' ||
          key === 'profilePhoto'
        ) {
          stepDataToValidate[key] = value === null ? undefined : (value as any);
        } else {
          stepDataToValidate[key] = value as any;
        }
      });

      const validationResult = currentStepConfig.validate(stepDataToValidate);
      setValidationErrors((prevErrors) => ({ ...prevErrors, ...validationResult.errors }));

      if (validationResult.isValid) {
        setFormState((prev) => Math.min(prev + 1, 4));
      }
    } else if (formState === 3) {
      if (isStepValid) {
        setFormState((prev) => Math.min(prev + 1, 4));
      }
    } 
  };

  const handlePrev = () => {
    setFormState((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (formState === 4) {
      const { password, passwordConfirmation, termsAndConditions } = formData;
      const validation = validateStepFourForm(password, passwordConfirmation, termsAndConditions);

      setValidationErrors(validation.errors);

      if (validation.isValid) {
        setSubmitError(null);
        setIsSubmitting(true);

        try {
          const requestData = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phoneNumber: formData.phoneNumber,
            nik: formData.nik,
            npwp: formData.npwp,
            aboutMe: formData.aboutMe,
            experienceYears: parseExperienceYearsToInt(formData.yearsOfExperience ?? ''),
            skkLevel: formData.skkLevel,
            currentLocation: formData.currentLocation,
            preferredLocations: formData.preferredLocations || [],
            skill: formData.skill === 'lainnya' ? formData.otherSkill : formData.skill,
            price: formData.price,
            password: formData.password,
          };

          console.log('Registration request data:', requestData);
          const response = await fetch('http://88.222.245.148:8080/api/auth/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify(requestData),
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Registration failed');
          }

          const responseData = await response.json().catch(() => ({}));
          Sentry.captureMessage('Registration successful', responseData);
          console.log('Registration successful:', responseData);
          
          window.location.href = '/login';
        } catch (error) {
          Sentry.captureException(error, {
            extra: {
              formData,
              context: 'RegisterModule.handleSubmit',
            },
          });
          console.error('Registration error:', error);
          setSubmitError(
            error instanceof Error
              ? error.message
              : 'Failed to register. Please check if the server is running and CORS is properly configured.'
          );
        } finally {
          setIsSubmitting(false);
        }
      }
    }
  };

  const stepsContent: Record<number, ReactNode> = {
    1: <StepOneForm formData={formData} updateFormData={updateFormData} validationErrors={validationErrors} />,
    2: <StepTwoForm formData={formData} updateFormData={updateFormData} validationErrors={validationErrors} />,
    3: <StepThreeForm formData={formData} updateFormData={updateFormData} />,
    4: <StepFourForm formData={formData} updateFormData={updateFormData} validationErrors={validationErrors} />,
  };

  return (
    <div className="bg-rencanakan-sea-blue-500 flex min-h-screen w-full items-center justify-center pt-12 md:py-12">
      <div className="bg-rencanakan-pure-white mx-auto flex h-screen flex-col justify-center overflow-y-auto rounded-t-xl px-8 py-6 drop-shadow-md md:h-full md:w-lg md:rounded-xl">
        {stepsContent[formState]}

        {submitError && (
          <div className="mt-4 rounded-md bg-red-100 p-3 text-red-700">
            <p>{submitError}</p>
          </div>
        )}

        <div className="mt-4 flex justify-end space-x-2">
          {formState !== 1 && (
            <Button variant="primary-outline" onClick={handlePrev} disabled={isSubmitting}>
              Kembali
            </Button>
          )}
          <Button
            variant="primary"
            onClick={formState === 4 ? handleSubmit : handleNext}
            disabled={!isStepValid || isSubmitting}
          >
            {isSubmitting ? 'Memproses...' : formState === 4 ? 'Daftar Kerja' : 'Selanjutnya'}
          </Button>
        </div>
      </div>
    </div>
  );
};