import { Typography, Stepper, Input, Button } from '@/components';
import { ReactNode, useState } from 'react';
import { StepOneForm } from './Section/register-1';
import { StepTwoForm } from './Section/register-2';
import { RegisterFormData } from '@/lib/register';

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
    setFormData((prev) => ({
      ...prev,
      ...data,
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
          (formData.skill === 'lainnya' ? formData.otherSkill : true) &&
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
      setFormState((prev) => Math.min(prev + 1, 4));
    }
  };

  const handlePrev = () => {
    setFormState((prev) => Math.max(prev - 1, 1));
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
    <div className="bg-rencanakan-sea-blue-500 flex min-h-screen w-full items-center justify-center pt-12 md:py-12">
      <div className="bg-rencanakan-pure-white mx-auto flex h-screen flex-col justify-center overflow-y-auto rounded-t-xl px-8 py-6 drop-shadow-md md:h-full md:w-lg md:rounded-xl">
        {stepsContent[formState]}

        <div className="mt-4 flex justify-end space-x-2">
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
            {formState === 4 ? 'Daftar Kerja' : 'Selanjutnya'}
          </Button>
        </div>
      </div>
    </div>
  );
};
