import { Button } from '@/components';
import { ReactNode, useState } from 'react';
import { StepOneForm } from './Section/register-1';
import { StepTwoForm } from './Section/register-2';
import { StepFourForm } from "./Section/register-4";
import { RegisterFormData } from '@/lib/register';
import { StepThreeForm } from './Section/register-3';
import { validatePasswordSection } from "@/lib/validation/passwordValidation";
import { validateStepOneForm } from "@/lib/validation/stepOneFormValidation";
import { useNavigate } from "react-router-dom";

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
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    nik?: string;
    npwp?: string;
    password?: string;
    passwordConfirmation?: string;
  }>({});

  const navigate = useNavigate();

  const updateFormData = (data: Partial<RegisterFormData>) => {
    setFormData((prev) => {
      const newData = { ...prev, ...data };
      console.log("Updated Form Data:", newData); 
      return newData;
    });
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
          formData.preferedLocations &&
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

  const isStepValid = true;

  const handleNext = () => {
    if (formState === 1) {
      const { firstName, lastName, email, phoneNumber, nik, npwp } = formData;
      console.log('Step 1 Form Data:', formData);
      const stepOneValidation = validateStepOneForm({
        firstName,
        lastName,
        email,
        phoneNumber,
        nik,
        npwp,
      });

      setValidationErrors(stepOneValidation.errors);
      console.log('Step 1 Validation:', stepOneValidation);

      if (stepOneValidation.isValid) {
        console.log('Step 1 Form Data:', formData);
        setFormState((prev) => Math.min(prev + 1, 4));
      }
      return; 
    }
    
    // isStepValid = True;
      setFormState((prev) => Math.min(prev + 1, 4));
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
        navigate('/login');

      }
    }
  };

  const stepsContent: Record<number, ReactNode> = {
    1: <StepOneForm 
        formData={formData} 
        updateFormData={updateFormData}
        validationErrors={validationErrors} 
        />,
    2: <StepTwoForm formData={formData} updateFormData={updateFormData} />,
    3: <StepThreeForm formData={formData} updateFormData={updateFormData} />,
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
