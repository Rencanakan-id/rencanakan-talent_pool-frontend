import { Button } from '@/components';
import { ReactNode, useState } from 'react';
import { StepOneForm } from './Section/register-1';
import { StepTwoForm } from './Section/register-2';
import { StepFourForm } from './Section/register-4';
import { RegisterFormData } from '@/lib/register';
import { StepThreeForm } from './Section/register-3';
import { validatePasswordSection } from '@/lib/validation/stepFourFormValidation';
import { validateStepOneForm } from '@/lib/validation/stepOneFormValidation';
import { validateStepTwoForm } from '@/lib/validation/stepTwoFormValidation';
import { checkStepCompleteness } from '@/lib/validation/formCompletenessValidation';
import { useNavigate } from 'react-router-dom';

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
  const [formCompleteness, setFormCompleteness] = useState({
    step4Complete: false,
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

  const navigate = useNavigate();

  const updateFormData = (data: Partial<RegisterFormData>) => {
    setFormData((prev) => {
      const newData = { ...prev, ...data };
      console.log('Updated Form Data:', newData);
      return newData;
    });
  };

  const updateFormCompleteness = (isComplete: boolean) => {
    setFormCompleteness((prev) => ({
      ...prev,
      step4Complete: isComplete,
    }));
  };

  const isStepValid = checkStepCompleteness(formState, formData);

  const handleNext = () => {
    if (formState === 1) {
      const { firstName, lastName, email, phoneNumber, nik, npwp, ktpFile, npwpFile, diplomaFile } =
        formData;
      console.log('Step 1 Form Data:', formData);
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
      console.log('Step 1 Validation:', stepOneValidation);

      if (stepOneValidation.isValid) {
        console.log('Step 1 Form Data:', formData);
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
      console.log('Step 2 Form Data:', formData);

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
      console.log('Step 2 Validation:', stepTwoValidation);

      if (stepTwoValidation.isValid) {
        console.log('Step 2 Form Data Valid:', formData);
        setFormState((prev) => Math.min(prev + 1, 4));
      }
      return;
    }

    setFormState((prev) => Math.min(prev + 1, 4));
  };

  const handlePrev = () => {
    setFormState((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (formState === 4) {
      const { password, passwordConfirmation, termsAndConditions } = formData;
      const validation = validatePasswordSection(
        password,
        passwordConfirmation,
        termsAndConditions
      );

      setValidationErrors(validation.errors);

      if (validation.isValid) {
        updateFormCompleteness(true);
      }
      if (validation.isValid && formCompleteness.step4Complete) {
        navigate('/login');
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
        updateFormCompleteness={updateFormCompleteness}
        validationErrors={validationErrors}
      />
    ),
  };

  return (
    <div className="bg-rencanakan-sea-blue-500 flex min-h-screen w-full items-center justify-center pt-12 md:py-12">
      <div className="bg-rencanakan-pure-white mx-auto flex h-screen flex-col justify-center overflow-y-auto rounded-t-xl px-8 py-6 drop-shadow-md md:h-full md:w-lg md:rounded-xl">
        {stepsContent[formState]}

        <div className="mt-4 flex justify-end space-x-2">
          {formState !== 1 && (
            <Button variant="primary-outline" onClick={handlePrev}>
              Kembali
            </Button>
          )}
          <Button
            variant="primary"
            onClick={formState === 4 ? handleSubmit : handleNext}
            disabled={!isStepValid}
          >
            {formState === 4 ? 'Daftar Kerja' : 'Selanjutnya'}
          </Button>
        </div>
      </div>
    </div>
  );
};
