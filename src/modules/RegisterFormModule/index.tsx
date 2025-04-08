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
    setFormData((prev) => {
      const newData = { ...prev, ...data };
      return newData;
    });
  };

  const isStepValid = checkStepCompleteness(formState, formData);

  const handleNext = () => {
    if (formState === 1) {
      const { firstName, lastName, email, phoneNumber, nik, npwp, ktpFile, npwpFile, diplomaFile } =
        formData;
      const stepOneValidation = validateStepOneForm({
        firstName,
        lastName,
        email,
        phoneNumber,
        nik,
        npwp,
        ktpFile: ktpFile === null ? undefined : ktpFile,
        npwpFile: npwpFile === null ? undefined : npwpFile,
        diplomaFile: diplomaFile === null ? undefined : diplomaFile,
      });

      setValidationErrors(stepOneValidation.errors);

      if (stepOneValidation.isValid) {
        setFormState((prev) => Math.min(prev + 1, 4));
      }
      return;
    }

    if (formState === 2) {
      const {
        aboutMe,
        yearsOfExperience,
        skkLevel,
        currentLocation,
        preferredLocations,
        skill,
        otherSkill,
        skkFile,
      } = formData;

      const stepTwoValidation = validateStepTwoForm({
        aboutMe,
        yearsOfExperience,
        skkLevel,
        currentLocation,
        preferredLocations,
        skill,
        otherSkill,
        skkFile: skkFile === null ? undefined : skkFile,
      });

      setValidationErrors(stepTwoValidation.errors);

      if (stepTwoValidation.isValid) {
        setFormState((prev) => Math.min(prev + 1, 4));
      }
      return;
    }

    setFormState((prev) => Math.min(prev + 1, 4));
  };

  const handlePrev = () => {
    setFormState((prev) => Math.max(prev - 1, 1));
  };

  const parseExperienceYears = (yearsExp: string ): number | undefined => {
    switch (yearsExp) {
      case '1 Tahun':
        return 1;
      case '2-3 Tahun':
        return 2;
      case '5 Tahun':
        return 3;
      case '> 5 Tahun':
        return 4;
    }
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
            experienceYears: parseExperienceYears(formData.yearsOfExperience || ''),
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
          console.log('Registration successful:', responseData);
          
          window.location.href = '/login';
        } catch (error) {
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
    1: (
      <StepOneForm
        formData={formData}
        updateFormData={updateFormData}
        validationErrors={validationErrors}
      />
    ),
    2: (
      <StepTwoForm
        formData={formData}
        updateFormData={updateFormData}
        validationErrors={validationErrors}
      />
    ),
    3: <StepThreeForm formData={formData} updateFormData={updateFormData} />,
    4: (
      <StepFourForm
        formData={formData}
        updateFormData={updateFormData}
        validationErrors={validationErrors}
      />
    ),
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
