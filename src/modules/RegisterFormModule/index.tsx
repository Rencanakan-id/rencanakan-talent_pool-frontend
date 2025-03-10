import { Typography, Stepper, Input, Button } from '@/components';
import { ReactNode, useState } from 'react';
import { StepOneForm } from './Section/register-1';
import { StepTwoForm } from './Section/register-2';
import { StepFourForm } from "./Section/register-4";
import { RegisterFormData } from '@/lib/register';
import { validatePasswordSection } from "@/lib/validation/passwordValidation";

export const RegisterModule = () => {
  const [formState, setFormState] = useState(1);
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    nik: '',
    npwp: '',
    ktpFile: null,
    npwpFile: null,
    diplomaFile: null,
    price: '',
    password: '',
    passwordConfirmation: '',
  });
  const [formCompleteness, setFormCompleteness] = useState({
    step4Complete: false
  });
  const [validationErrors, setValidationErrors] = useState<{
    password?: string;
    passwordConfirmation?: string;
  }>({});

  const updateFormData = (data: Partial<RegisterFormData>) => {
    setFormData((prev) => ({
      ...prev,
      ...data,
    }));
  };


  const updateFormCompleteness = (isComplete: boolean) => {
    setFormCompleteness(prev => ({
      ...prev,
      step4Complete: isComplete
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(
          formData.firstName &&
          formData.lastName &&
          formData.email &&
          formData.phoneNumber &&
          formData.nik &&
          formData.npwp
        );
      case 2:
        return !!(
          formData.aboutMe &&
          formData.yearsOfExperience &&
          formData.skkLevel &&
          formData.currentLocation &&
          formData.prefferedLocations &&
          formData.skill &&
          (formData.skill === 'lainnya' ? formData.otherSkill : true)
        );
      case 3:
        return !!formData.price;
      case 4:
        // For step 4, we only check if fields are filled, not if they're valid
        return formCompleteness.step4Complete;
      default:
        return true;
    }
  };

  const isStepValid = validateStep(formState);

  const handleNext = () => {
    if (isStepValid) {
      setFormState((prev) => Math.min(prev + 1, 4));
    }
  };

  const handlePrev = () => {
    setFormState((prev) => Math.max(prev - 1, 1));
  };


  const handleSubmit = () => {
    if (formState === 4) {
      // Validate the form before submission
      const { password, passwordConfirmation, termsAndConditions } = formData;
      const validation = validatePasswordSection(password, passwordConfirmation, termsAndConditions);
      
      // Set validation errors
      setValidationErrors(validation.errors);
      
      // If form is valid, proceed with submission
      if (validation.isValid) {
        console.log('Final Form Data:', formData);
        // Here you would submit the form data
      }
    }
  };

  const stepsContent: Record<number, ReactNode> = {
    1: <StepOneForm formData={formData} updateFormData={updateFormData} />,
    2: <StepTwoForm formData={formData} updateFormData={updateFormData} />,
    3: (
      <>
        <Typography variant="h5" className="text-center">
          Lengkapi formulir dan mulai perjalanan karier kamu!
        </Typography>
        <div className="mx-4 my-4 items-center justify-center">
          <Stepper currentStep={2} />
        </div>
        <div className="my-4 space-y-4">
          <Typography variant="h6" className="mb-4">
            Harga Kamu
          </Typography>
          <Input
            name="price"
            label="Harga Kamu"
            placeholder="Masukkan harga kamu"
            type="number"
            value={formData.price || ''}
            onChange={(e) => updateFormData({ price: e.target.value })}
          />
        </div>
      </>
    ),
    4: <StepFourForm 
        formData={formData} 
        updateFormData={updateFormData}
        updateFormCompleteness={updateFormCompleteness}
        validationErrors={validationErrors}
       />,
  };

  return (
    <div className="bg-rencanakan-sea-blue-500 flex min-h-screen w-full items-center justify-center pt-12 md:py-12">
      <div className="bg-rencanakan-pure-white mx-auto flex h-screen flex-col justify-center overflow-y-auto rounded-t-xl px-8 py-6 drop-shadow-md md:h-full md:w-lg md:rounded-xl">
        {stepsContent[formState]}

        <div className="mt-4 flex justify-end space-x-2">
          <Button variant="primary-outline" onClick={handlePrev}>
            Kembali
          </Button>
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
