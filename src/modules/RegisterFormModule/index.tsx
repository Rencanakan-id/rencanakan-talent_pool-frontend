import { Typography, Stepper, Input, Button } from "@/components";
import { ReactNode, useState } from "react";
import { StepOneForm } from "./Section/register-1";
import { StepFourForm } from "./Section/register-4";
import { RegisterFormData } from "@/lib/register";
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
    address: '',
    city: '',
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
    setFormData(prev => ({
      ...prev,
      ...data
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
        return !!(formData.address && formData.city);
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
      setFormState(prev => Math.min(prev + 1, 4));
    }
  };

  const handlePrev = () => {
    setFormState(prev => Math.max(prev - 1, 1));
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
    2: (
      <>
        <Typography variant="h5" className="text-center">
          Lengkapi formulir dan mulai perjalanan karier kamu!
        </Typography>
        <div className="w-full flex justify-center">
          <Stepper currentStep={formState - 1} />
        </div>
        <div className="my-4 space-y-4">
          <Typography variant="h6" className="mb-4">Alamat Lengkap</Typography>
          <Input name="address" label="Alamat" placeholder="Alamat lengkap" 
            value={formData.address || ''} 
            onChange={(e) => updateFormData({ address: e.target.value })} 
          />
          <Input name="city" label="Kota" placeholder="Kota" 
            value={formData.city || ''} 
            onChange={(e) => updateFormData({ city: e.target.value })} 
          />
        </div>
      </>
    ),
    3: (
      <>
        <Typography variant="h5" className="text-center">
          Lengkapi formulir dan mulai perjalanan karier kamu!
        </Typography>
        <div className="my-4 mx-4 justify-center items-center">
          <Stepper currentStep={2} />
        </div>
        <div className="my-4 space-y-4">
          <Typography variant="h6" className="mb-4">Harga Kamu</Typography>
          <Input name="price" label="Harga Kamu" placeholder="Masukkan harga kamu" 
            type="number" value={formData.price || ''} 
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
    <div className="flex min-h-screen w-full justify-center items-center bg-rencanakan-sea-blue-500 pt-12 md:py-12">
      <div className="overflow-y-auto flex h-screen md:h-full flex-col justify-center bg-rencanakan-pure-white rounded-t-xl md:rounded-xl drop-shadow-md md:w-lg mx-auto py-6 px-8">
        {stepsContent[formState]}

        <div className="flex justify-end mt-4 space-x-2">
          <Button variant="primary-outline" onClick={handlePrev}>
            Kembali
          </Button>
          <Button 
            variant="primary" 
            onClick={formState === 4 ? handleSubmit : handleNext} 
            disabled={!isStepValid}
          >
            {formState === 4 ? "Daftar Kerja" : "Selanjutnya"}
          </Button>
        </div>
      </div>
    </div>
  );
};
