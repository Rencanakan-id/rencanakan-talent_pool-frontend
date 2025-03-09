import { Typography, Stepper, Input, Button } from "@/components";
import { ReactNode, useState } from "react";
import { StepOneForm } from "./Section/register-1";
import { StepTwoForm } from "./Section/register-2";
import { RegisterFormData } from "@/lib/register";

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
  });

  const updateFormData = (data: Partial<RegisterFormData>) => {
    setFormData(prev => ({
      ...prev,
      ...data
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
          formData.npwp && 
          formData.ktpFile && 
          formData.npwpFile && 
          formData.diplomaFile
        );
      case 2:
        return !!(
          formData.aboutMe &&
          formData.yearsOfExperience &&
          formData.skkLevel &&
          formData.currentLocation &&
          formData.prefferedLocations &&
          formData.skill &&
          (formData.skill === "Lainnya" ? formData.otherSkill : true) &&
          formData.skkFile
        );
      case 3:
        return !!formData.price;
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

  const stepsContent: Record<number, ReactNode> = {
    1: <StepOneForm formData={formData} updateFormData={updateFormData} />,
    2: <StepTwoForm formData={formData} updateFormData={updateFormData} />,
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
    4: (
      <div className="text-center">
        <Typography variant="h5" className="mb-4">
          Under development
        </Typography>
      </div>
    ),
  };

  const handleSubmit = () => {
    if (formState === 4) {
      console.log('Final Form Data:', formData);
    }
  };

  return (
    <div className="flex min-h-screen w-full justify-center items-center bg-rencanakan-sea-blue-500 pt-12 md:py-12">
      <div className="overflow-y-auto flex h-screen md:h-full flex-col justify-center bg-rencanakan-pure-white rounded-t-xl md:rounded-xl drop-shadow-md md:w-lg mx-auto py-6 px-8">
        {stepsContent[formState]}

        <div className="flex justify-end mt-4 space-x-2">
          {formState > 1 && formState < 4 && (
            <Button variant="primary-outline" onClick={handlePrev}>
              Kembali
            </Button>
          )}
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
