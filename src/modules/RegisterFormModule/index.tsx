import { Button } from '@/components';
import { ReactNode, useState } from 'react';
import { StepOneForm } from './Section/register-1';
import { StepTwoForm } from './Section/register-2';
import { StepFourForm } from "./Section/register-4";
import { RegisterFormData } from '@/lib/register';
import { StepThreeForm } from './Section/register-3';
import { validatePasswordSection } from "@/lib/validation/passwordValidation";
import { validateStepOneForm } from "@/lib/validation/stepOneFormValidation";
import { validateStepTwoForm } from "@/lib/validation/stepTwoFormValidation";
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
    aboutMe: '',
    yearsOfExperience: '',
    skkLevel: '',
    currentLocation: '',
    preferredLocations: [],
    skill: '',
    otherSkill: '',
    skkFile: null,
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
    aboutMe?: string;
    yearsOfExperience?: string;
    skkLevel?: string;
    currentLocation?: string;
    preferredLocations?: string;
    skill?: string;
    otherSkill?: string;
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
    
    if (formState === 2) {
      const { aboutMe, yearsOfExperience, skkLevel, currentLocation, preferredLocations, skill, otherSkill } = formData;
      console.log('Step 2 Form Data:', formData);
      
      const stepTwoValidation = validateStepTwoForm({
        aboutMe,
        yearsOfExperience,
        skkLevel,
        currentLocation,
        preferredLocations,
        skill,
        otherSkill
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
      // Validate the form before submission
      const { password, passwordConfirmation, termsAndConditions } = formData;
      const validation = validatePasswordSection(password, passwordConfirmation, termsAndConditions);
      
      // Set validation errors
      setValidationErrors(validation.errors);

      if (validation.isValid) {
        updateFormCompleteness(true);
      }
      // If form is valid, proceed with submission
      if (validation.isValid && formCompleteness.step4Complete) {
        console.log('Final Form Data:', formData);
        const requestBody = {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phoneNumber,
          address: null,
          job: "Software Engineer",
          photo: null, 
          token_amount: 0,
          demo_quota: 1,
          password: formData.password,
          password_confirmation: formData.passwordConfirmation,
        };
  
        try {
          const response = await fetch('https://54.227.49.85:8000/api/auth/register-talent', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          });
  
          const result = await response.json();
          if (response.ok) {
            console.log("Registration successful:", result);
            navigate("/login");
          } else {
            console.error("Registration failed:", result);
          }
        } catch (error) {
          console.error("Network error:", error);
        }
      }
    }
  };

  const stepsContent: Record<number, ReactNode> = {
    1: <StepOneForm 
        formData={formData} 
        updateFormData={updateFormData}
        validationErrors={validationErrors} 
        />,
    2: <StepTwoForm 
        formData={formData} 
        updateFormData={updateFormData}
        validationErrors={validationErrors}
        />,
    3: <StepThreeForm formData={formData} updateFormData={updateFormData} />,
    4: <StepFourForm 
        formData={formData} 
        updateFormData={updateFormData}
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
