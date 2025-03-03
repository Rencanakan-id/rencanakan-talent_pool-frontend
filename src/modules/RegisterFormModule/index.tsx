import { Typography, Stepper, Input, Button } from "@/components";
import { ReactNode, useState } from "react";
import { StepOneForm } from "./register-1";

export const RegisterModule = () => {
  const [formState, setFormState] = useState(1);

  const handleNext = () => setFormState(prev => Math.min(prev + 1, 4));
  const handlePrev = () => setFormState(prev => Math.max(prev - 1, 1));

  const stepsContent: Record<number, ReactNode> = {
    1: <StepOneForm />,
    2: (
      <>
        <Typography variant="h5" className="text-center">
          Lengkapi formulir dan mulai perjalanan karier kamu!
        </Typography>
        <div className="my-4 mx-4 justify-center items-center">
          <Stepper currentStep={1} />
        </div>
        <div className="my-4">
          <Typography variant="h6" className="mb-4">Step 2 Content</Typography>
          <div className="space-y-4">
            <Input label="Alamat" placeholder="Alamat lengkap" />
            <Input label="Kota" placeholder="Kota" />
          </div>
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
        <div className="my-4">
          <Typography variant="h6" className="mb-4">Step 3 Content</Typography>
          <div className="space-y-4">
            <Input label="Harga Kamu" placeholder="Masukkan harga kamu" />
          </div>
        </div>
      </>
    ),
    4: (
      <Typography variant="h5" className="text-center">
        This step is currently not available
      </Typography>
    ),
  };

  return (
    <div className="flex min-h-screen w-full justify-center items-center bg-rencanakan-sea-blue-500 pt-12 md:py-12">
      <div className="overflow-y-auto flex h-screen md:h-full flex-col justify-center bg-rencanakan-pure-white rounded-t-xl md:rounded-xl drop-shadow-md md:w-lg mx-auto py-6 px-8">
        
        {stepsContent[formState]}

        <div className="flex justify-end mt-4 space-x-2">
          {formState > 1 && (
            <Button variant="primary-outline" onClick={handlePrev}>
              Kembali
            </Button>
          )}
          <Button variant="primary" onClick={handleNext}>
            {formState === 4 ? "Daftar Kerja" : "Selanjutnya"}
          </Button>
        </div>
      </div>
    </div>
  );
};
